import { db } from '@/backend/api/firebase';
import generateID from '@/backend/constants/generateID';
import { groupBy } from '@/backend/constants/groupBy';
import { EmployeeData } from '@/backend/models/employeeData';
import { PositionDefinitionData } from '@/backend/models/positionDefinitionData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, DatePicker, Divider, Form, Input, Row, Select, message } from 'antd';
import dayjs from 'dayjs';
import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CustomModal from '../customModal';
import { updateEmployee } from '@/backend/api/HR-Manager/updateEmployee';

export default function HRManagerEditEmployeeModal(
    {
        open,
        setOpen,
        data,
        docID,
    }: {
        open: boolean,
        setOpen: any,
        data: EmployeeData,
        docID: string,
    }
) {
    const matches = useMediaQuery('(min-width:900px)');

    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                modalTitle='Edit Employee'
                width={matches ? "50%" : "100%"}
            >
                <EditEmployee setOpen={setOpen} data={data} docID={docID} />
            </CustomModal>
        </>
    );
}

function EditEmployee(
    {
        setOpen,
        data,
        docID,
    }: {
        setOpen: any,
        data: any,
        docID: string,
    }
) {
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    const [employees, setEmployees] = useState<any>([]);
    const [reporteesOptions, setReporteesOptions] = useState<any[]>([]);
    useEffect(() => onSnapshot(collection(db, "employee"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const options: any[] = [];
        data.forEach(user => {
            options.push(
                {
                    label: user.employeeID,
                    value: user.employeeID,
                }
            );
        });

        setEmployees(data);
        setReporteesOptions(options);

    }), []);

    const [contractTypes, setContractTypes] = useState<any[]>([]);
    const [shiftTypes, setShiftTypes] = useState<any[]>([]);
    const [employmentPositions, setEmploymentPositions] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [reasonOfLeaving, setReasonOfLeaving] = useState<any[]>([]);
    const [bands, setBands] = useState<any[]>([]);
    const [pid, setPid] = useState<any[]>([]);

    useEffect(() => onSnapshot(collection(db, "hrSettings"), (snapshot: QuerySnapshot<DocumentData>) => {
        const data: any[] = [];
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });
        const groupedSettings: any = groupBy("type", data);

        const contractTypes: any[] = groupedSettings["Contract Type"] ?? [];
        const contractTypeOptions: any[] = contractTypes.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name }));
        setContractTypes(contractTypeOptions);

        const shiftTypes: any[] = groupedSettings["Shift Type"] ?? [];
        setShiftTypes(shiftTypes.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name })));

        const sections: any[] = groupedSettings["Section"] ?? [];
        setSections(sections.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name })));

        const departments: any[] = groupedSettings["Department"] ?? [];
        setDepartments(departments.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name })));

        const reo: any[] = groupedSettings["Reason of Leaving"] ?? [];
        setReasonOfLeaving(reo.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name })));

        const bands: any[] = groupedSettings["Band"] ?? [];
        setBands(departments.map((doc) => doc.active === "Yes" && ({ label: doc.name, value: doc.name })));

        const pid: any[] = groupedSettings['Position Definition'] ?? [];
        const pidOptions: any[] = pid.map((pid: PositionDefinitionData) => pid.active === "Yes" && ({ label: pid.pid, value: pid.pid }));
        setPid(pidOptions);

    }), []);

    useEffect(() => {
        if (data && docID) {
            const dates: string[] = [
                'birthDate',
                'contractStartingDate',
                'contractTerminationDate',
                'contractTerminationDate',
                'probationPeriodEndDate',
                'lastDateOfProbation',
            ];

            const keys: string[] = Object.keys(data);
            keys.forEach((key) => {
                if (dates.includes(key)) form.setFieldValue(key, dayjs(data[key], "MMMM DD, YYYY"));
                else form.setFieldValue(key, data[key]);
            });
        }
    }, [data, docID, form]);

    const success = () => {
        message.success('Success.');
    };

    const error = () => {
        message.error('Something went wrong. Please Try Again.');
    };

    const formFailed = () => {
        message.error('Please Make Sure All Fields Are Filled');
    };

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);

            const dates: string[] = [
                'birthDate',
                'contractStartingDate',
                'contractTerminationDate',
                'contractTerminationDate',
                'probationPeriodEndDate',
                'lastDateOfProbation',
            ];

            const keys: string[] = Object.keys(values);
            keys.forEach((key) => {
                if (values[key] === undefined) values[key] = null;
                if (dates.includes(key) && values[key]) values[key] = dayjs(values[key]).format("MMMM DD, YYYY");
            });

            // console.log("values: ", values);

            await updateEmployee(values, docID)
                .then((res: boolean) => {

                    if (res === true) {
                        success();
                        setLoading(false);
                        setOpen(false);
                        form.resetFields();
                    }

                    if (res === false) {
                        error();
                        setLoading(false);
                    }
                })
                .catch((err: any) => {
                    console.log("error adding leave request: ", err);
                    formFailed();
                    setLoading(false);
                });

            setLoading(false);
        }).catch((err) => {
            formFailed();
            setLoading(false);
            console.log("Validation Error: ", err);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        formFailed();
    };

    return (
        <>
            <Divider
                style={{
                    marginTop: "1em",
                    marginBottom: "1em",
                }}
            />

            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                {/* Employee Information */}
                <>
                    <Divider orientation='left'>
                        Employee Information
                    </Divider>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Birth Date"
                        name="birthDate"
                        rules={[{ required: true, message: "" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"MMMM DD, YYYY"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Birth Place"
                        name="birthPlace"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={["Male", "Female"].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Marital Status"
                        name="maritalStatus"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%", }}
                            options={["Single", "Married", "Divorced", "Widowed", "Separated"].map((value) => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Personal Phone Number"
                        name="personalPhoneNumber"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Personal Email"
                        name="personalEmail"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Bank Account"
                        name="bankAccount"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tin Number"
                        name="tinNumber"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="User Account Password"
                        name="password"
                        rules={[{ required: true, message: "" }]}
                        initialValue={generateID()}
                    >
                        <Input.Password minLength={4} />
                    </Form.Item>
                </>

                {/* Contract Information */}
                <>
                    <Divider orientation='left'>
                        Contract Information
                    </Divider>

                    <Form.Item
                        label="Contract Type"
                        name="contactType"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={contractTypes}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Contact Status"
                        name="contactStatus"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={["Active", "Inactive"].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Contact Starting Date"
                        name="contactStartingDate"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"MMMM DD, YYYY"}
                            onChange={(value) => {
                                if (value) {
                                    const probationPeriodEndDate: dayjs.Dayjs = value?.add(60, 'day');

                                    form.setFieldValue('probationPeriodEndDate', probationPeriodEndDate);
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Contact Termination Date"
                        name="contactTerminationDate"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"MMMM DD, YYYY"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Probation Period End Date"
                        name="probationPeriodEndDate"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"MMMM DD, YYYY"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Last Date of Probation"
                        name="lastDateOfProbation"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"MMMM DD, YYYY"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reason of Leaving"
                        name="reasonOfLeaving"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={reasonOfLeaving}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Salary"
                        name="salary"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Eligible Leave Days"
                        name="eligibleLeaveDays"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Number of Leave Days Taken"
                        name="numberOfLeaveDaysTaken"
                        // rules={[{ required: true, message: "" }]}
                        initialValue={0}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Company Email"
                        name="companyEmail"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Company Phone Number"
                        name="companyPhoneNumber"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>
                </>

                {/* Position Information */}
                <>
                    <Divider orientation='left'>
                        Position Information
                    </Divider>

                    <Form.Item
                        label="Employment Position"
                        name="employmentPosition"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={pid}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Position Level"
                        name="positionLevel"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={[].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Section"
                        name="section"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={sections}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={departments}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Working Location"
                        name="workingLocation"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={[].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Manager Position"
                        name="managerPosition"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={["Yes", "No"].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reportees"
                        name="reportees"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={reporteesOptions}
                            mode='multiple'
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reporting Line Manager Position"
                        name="reportingLineManagerPosition"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={[].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reporting Line Manager Name"
                        name="reportingLineManagerName"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={[].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Grade Level"
                        name="gradeLevel"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={[].map(value => ({ label: value, value: value }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Band"
                        name="band"
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={bands}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Shift Type"
                        name="shiftType"
                        rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={shiftTypes}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Transport Allowance"
                        name="transportAllowance"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mobile Allowance"
                        name="mobileAllowance"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Other Allowance"
                        name="otherAllowance"
                    // rules={[{ required: true, message: "" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: "" }]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 2000, }}
                            options={["Employee", "HR Manager", "Manager"].map(value => ({ label: value, value: value }))}
                            mode='multiple'
                        />
                    </Form.Item>
                </>

                <Row align={"middle"} justify={"center"}>
                    <Form.Item>
                        <Button
                            type='primary'
                            loading={loading}
                            htmlType='submit'
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
}

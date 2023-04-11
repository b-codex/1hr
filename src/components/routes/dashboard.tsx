import PageContainer from '@/components/container/PageContainer';
import FullLayout from '@/layouts/full/FullLayout';
import type { ReactElement } from 'react';

export default function Home() {
    return (
        <PageContainer title="Dashboard" description="Dashboard">
            {/* <ProductPerformance /> */}
        </PageContainer>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};

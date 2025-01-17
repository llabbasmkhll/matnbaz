import { useMemo } from 'react';
import HeaderMeta, { IHeaderMetaTags } from '../components/Feature/HeaderMeta';
import RepositoryFilters from '../components/Filter/RepositoryFilters';
import MainLayout from '../components/Layout/MainLayout';
import SubmitUserModal from '../components/Modal/SubmitUserModal';
import RepositoryPreviewList from '../components/Repository/RepositoryPreviewList';
import Button from '../components/UI/Button/Button';
import Divider from '../components/UI/Divider';
import { useGetRepositoriesLazyQuery } from '../lib/graphql-types';

export const exploreMetaTags: IHeaderMetaTags = {
  title: 'کاوش‌گر',
  description: 'پروژه های متن باز (Open Source) مختلف ایرانی را پیدا کنید.',
};

const Explore = () => {
  const [
    getRepositories,
    { loading, data, error, fetchMore, refetch, networkStatus, called },
  ] = useGetRepositoriesLazyQuery({ notifyOnNetworkStatusChange: true });
  const repositories = useMemo(() => data?.repositories.edges, [data]);
  const repositoriesPageInfo = useMemo(
    () => data?.repositories.pageInfo,
    [data]
  );
  const repositoriesLoadMoreHandler = () => {
    if (!repositoriesPageInfo?.hasNextPage || !repositoriesPageInfo) return;

    fetchMore({
      variables: {
        after: repositoriesPageInfo.endCursor,
      },
    });
  };

  const page = error ? (
    <div className="flex flex-col space-y-7 items-center justify-center h-80">
      <h1 className="text-5xl font-bold text-red-500 dark:text-red-400">
        خطای سرور
      </h1>
      <span className="text-2xl text-center">
        درحال حاضر در سرور مشکلی پیش آمده. لطفا چند لحظه بعد دوباره تلاش کنید.
      </span>
      <Divider />
      <Button.Primary
        disabled={loading}
        onClick={() => {
          refetch();
        }}
      >
        امتحان مجدد
      </Button.Primary>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-8 pb-6 gap-6">
      <div className="md:col-span-3 lg:col-span-2">
        <RepositoryFilters
          called={called}
          query={getRepositories}
          refetch={refetch}
          loading={loading}
        />
      </div>
      {data?.repositories?.edges.length === 0 ? (
        <div className="flex flex-col space-y-4 md:col-span-5 lg:col-span-6">
          <h1 className="text-2xl font-semibold">نتیجه ای یافت نشد.</h1>
          <span className="font-lg">
            نتیجه ای با فیلتر‌های وارد شده یافت نشد.
          </span>
          <Divider />
          <span className="text-sm text-secondary">
            می توانید با{' '}
            <SubmitUserModal className="text-blue-500" title="ثبت دستی کاربر" />{' '}
            به کاوش بهتر مخزن‌ها کمک کنید.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:col-span-5 lg:col-span-6 auto-rows-min">
          <RepositoryPreviewList
            loading={loading}
            networkStatus={networkStatus}
            called={called}
            repositories={repositories}
            onLoadMore={repositoriesLoadMoreHandler}
          />
        </div>
      )}
    </div>
  );

  return (
    <MainLayout withoutFooter={!error}>
      <HeaderMeta {...exploreMetaTags} withBanner />
      {page}
    </MainLayout>
  );
};

export default Explore;

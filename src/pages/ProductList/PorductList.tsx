import { useQuery } from '@tanstack/react-query'
// import { omitBy, isUndefined } from 'lodash'
import Paginate from '../../components/Paginate'
import ProductApi from '../../apis/product.api'
// import useQueryParams from '../../hook/useQueryParams'
import AsideFilter from './AsideFilter'
import Product from './Product'
import SortProductList from './SortProductList'
import { ProductListConfig } from '../../types/product.type'
import categoryApi from '../../apis/category.api'
import useQueryConfig from '../../hook/useQueryConfig'
import CarouselCustom from '../../components/Carousel/Carousel'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function PorductList() {
  const queryConfig = useQueryConfig()
  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return ProductApi.getProducts(queryConfig as ProductListConfig)
    },
    /*sau khi bam chuyen trang, khi du lieu chua do ve thi trang web tam thoi mat di 
      du lieu cua page cu de doi du lieu cua page moi, can phai giu lai du lieu cua page cu 
      trong khi goi du lieu cua page moi de tranh tinh trang bi giat trong luc chuyen den trang cu*/
    keepPreviousData: true
    // staleTime: 3 * 60 * 1000
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })
  // console.log(categoriesData)
  // const [page, setPage] = useState(1)
  return (
    <div className='bg-gray-200 py-3'>
      <div className='container'>
        {!queryConfig.name ? (
          <div>
            <CarouselCustom />
          </div>
        ) : null}

        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useAuthenticatedFetch } from '@/services/appBridge';

export function useProducts() {
  // const { tokenData } = useAuthStore();
  const fetchFunction = useAuthenticatedFetch();

  const getProducts = () => {
    fetchFunction.get('/products')
      .then((res: any) => {
        console.log(res);
      });
  };

  const getShopifyProducts = () => {
    fetchFunction.get('/shopify/products')
      .then((res: any) => {
        console.log('shopify: ', res);
      });
  };

  const getLoyaltyRules = () => {
    fetchFunction.get('/loyalty-rules')
      .then((res: any) => {
        console.log('loyalty: ', res);
      })
      .catch((err: any) => {
        console.log('loyalty: ', err);
      });
  };

  return {
    getProducts,
    getShopifyProducts,
    getLoyaltyRules,
  };
}

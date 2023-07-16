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

  const getLoyaltyRules = (): Promise<void> => new Promise((resolve, reject) => {
    fetchFunction.get('/loyalty-rules')
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });

  return {
    getProducts,
    getShopifyProducts,
    getLoyaltyRules,
  };
}

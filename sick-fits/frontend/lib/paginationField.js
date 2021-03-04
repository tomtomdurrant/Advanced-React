import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    /**
     *
     * @param {*} existing - current cache
     * @param {*} args - any arguments passed into the graphQL hook
     */
    read(existing = [], { args, cache }) {
      // console.log({ existing, args, cache });
      /*       
      First thing it does is asks the read function for the items
      1 of 2 things:
      - return the items as they are already in the cache
      - return false, do a network request 
      */
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      // console.log(data);
      const count = data?._allProductsMeta?.count;
      const currentPage = skip / first + 1;
      const totalPages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      if (
        items.length &&
        items.length !== first &&
        currentPage === totalPages
      ) {
        return items;
      }
      if (items.length !== first) {
        // we dont have any items, go to the network to fetch them
        return false;
      }

      // if there are items, return them from the cache
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache. Sending them to apollo`
        // );
        return items;
      }
      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      // Runs when the apollo client comes back from the network
      const { skip, first } = args;
      // console.log(`Merging items from the network ${incoming.length}`);
      // console.log(incoming);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // finally return the merged items from the cache
      return merged;
    },
  };
}

import {useReducer} from "react"
import {createSaleOffer} from "src/flow/tx.create-sale-offer"
import {paths, SUCCESS} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"

export default function useItemSale() {
  const {mutate} = useSWRConfig()

  const [state, dispatch] = useReducer(requestReducer, initialState)

  const sell = async (itemId, price) => {
    if (!itemId) throw "Missing itemId"
    if (!price) throw "Missing price"

    await createSaleOffer(
      {itemID: itemId, price: price},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          // TODO: Poll for created API offer instead of setTimeout
          setTimeout(() => {
            mutate(paths.apiSaleOffer(itemId))
            dispatch({type: SUCCESS})
          }, 1000)
        },
        async onError() {
          dispatch({type: ERROR})
        },
      }
    )
  }

  return [state, sell]
}

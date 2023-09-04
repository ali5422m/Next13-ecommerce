import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {toast} from "react-hot-toast";

type CartContextType = {
    cartTotalQty: number,
    cartTotalAmount: number,
    cartProducts: CartProductType[] | null,
    handleAddProductToCart : (product: CartProductType) => void
    handleRemoveProductFromCart : (product: CartProductType) => void
    handleCartQtyIncrease : (product: CartProductType) => void
    handleCartQtyDecrease : (product: CartProductType) => void
    handleClearCart : () => void
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartTotalAmount , setCartTotalAmount] = useState(0);
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null)

    useEffect(() => {
        const cartItem :any = localStorage.getItem('eShopCartItem');
        const cProducts: CartProductType[] | null = JSON.parse(cartItem)

        setCartProducts(cProducts)
    },[]);

    useEffect(() => {
        const getTotals = () => {
            if(cartProducts){
                const {total , qty} = cartProducts?.reduce((acc, item) => {
                        const itemTotal = item.price * item.quantity;

                        acc.total += itemTotal;
                        acc.qty += item.quantity;

                        return acc;
                    },
                    {
                        total: 0,
                        qty: 0,
                    }
                );
                setCartTotalQty(qty);
                setCartTotalAmount(total);
            }
        }

        getTotals();
    } ,[cartProducts])

    console.log("qty", cartTotalQty);
    console.log("total" , cartTotalAmount);


    const handleAddProductToCart = useCallback((product:CartProductType) => [
        setCartProducts((prev) => {
            let updatedCart;

            if(prev) {
                updatedCart = [...prev, product];
            }else{
                updatedCart = [product];
            }

            toast.success("Product added to cart");
            localStorage.setItem("eShopCartItem" , JSON.stringify(updatedCart))
            return updatedCart;
        })
    ] ,[])

    const handleRemoveProductFromCart = useCallback((product:CartProductType) => {
        if(cartProducts){
            const filterdProducts = cartProducts.filter((item) => item.id !== product.id);

            setCartProducts(filterdProducts);
            toast.success('Product removed');
            localStorage.setItem('eShopCartItem', JSON.stringify(filterdProducts));
        }
    } ,[cartProducts]);

    const handleCartQtyIncrease = useCallback((product:CartProductType) => {
        let updatedCart;

        if(product.quantity === 99){
            return toast.error("Ooops! Maximum reached")
        }

        if(cartProducts){
            updatedCart = [...cartProducts];

            const exisingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if(exisingIndex > -1){
                updatedCart[exisingIndex].quantity = ++updatedCart[exisingIndex].quantity
            }

            setCartProducts(updatedCart);
            localStorage.setItem("eShopCartItem" , JSON.stringify(updatedCart))
        }
    } ,[cartProducts])

    const handleCartQtyDecrease = useCallback((product:CartProductType) => {
        let updatedCart;

        if(product.quantity === 1){
            return toast.error("Ooops! Minimum reached")
        }

        if(cartProducts){
            updatedCart = [...cartProducts];

            const exisingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if(exisingIndex > -1){
                updatedCart[exisingIndex].quantity = --updatedCart[exisingIndex].quantity
            }

            setCartProducts(updatedCart);
            localStorage.setItem("eShopCartItem" , JSON.stringify(updatedCart))
        }
    } ,[cartProducts])

    const handleClearCart = useCallback(() => {
        setCartProducts(null);
        setCartTotalQty(0);
        localStorage.setItem("eShopCartItem" , JSON.stringify(null));
    } ,[cartProducts])

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart
    };

    return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartContextProvider");
    }

    return context;
};
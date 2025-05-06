import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
    uri: process.env.EXPO_PUBLIC_PROD_API
});

const authLink = setContext(async(_,{headers})=>{
    const token = await SecureStore.getItemAsync("token");
    return {
        headers: {
            ...headers,
            autorization: token ? `Bearer${token}`: "",
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),

    credentials: "include"
})
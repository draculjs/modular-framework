import apolloClient from '../../../apollo'

import {ApolloClient} from 'apollo-client'

import gql from "graphql-tag";
import {InMemoryCache} from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";


class ErrorProvider {

    constructor() {
        this.gqlc = null
        this.gqlcFail = null
        this.buildGqlcFail()
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    buildGqlcFail(){
        this.gqlcFail = new ApolloClient({
            link: createHttpLink({ uri: "http://localhost:666/graphql" }),
           // link: createHttpLink({ uri: "http://192.168.0.59:666/graphql" }),
            cache: new InMemoryCache(),
        })
    }


    getNotAuthorized(){
        return this.gqlc.query({
            query: gql`query {getNotAuthorized}`
        })
    }

    getAuthenticationError(){
        return this.gqlc.query({
            query: gql`query {getAuthenticationError}`
        })
    }

    getUserInputError(){
        return this.gqlc.query({
            query: gql`query {getUserInputError}`
        })
    }

   getApolloError(){
        return this.gqlc.query({
            query: gql`query {getApolloError}`
        })
    }

    getUnknownOperation(){
        return this.gqlc.query({
            query: gql`query {getUnknownOperation}`
        })
    }


    getMultipleErrors(){
        return this.gqlc.query({
            query: gql`query {getNotAuthorized getAuthenticationError getApolloError }`
        })
    }

    getCustomError(){
        return this.gqlc.query({
            query: gql`query {getCustomError }`
        })
    }

    getFail(){
        return this.gqlcFail.query({
            query: gql`query {getFail }`
        })
    }

    getTimeout(){
        return this.gqlc.query({
            query: gql`query {getTimeout }`
        })
    }
}
const errorProvider = new ErrorProvider()
errorProvider.setGqlc(apolloClient)
export default errorProvider

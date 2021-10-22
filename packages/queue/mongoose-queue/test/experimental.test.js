import mongoose from "mongoose";
import {qs} from '../src/services/QueueCrudService'
var assert = require('assert');
const {AssertionError} = require('assert');

describe("Experimental", () => {


        it('should return 4 elements with string no objectid ', async () => {

            let search = "some"
            let result = qs(search)
            assert.strictEqual(result.$or.length, 4);

        })

        it('should return 1 element with objectid ', async () => {

            let search = mongoose.Types.ObjectId()

            let result = qs(search)
            assert("_id" in result);

        })




    }
)

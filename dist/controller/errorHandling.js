"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = void 0;
// Error Handling
const errorHandling = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        };
    }
    return {
        success: true,
        data: data
    };
};
exports.errorHandling = errorHandling;
// export const query = (query: string, values: any) => {
//     return new Promise((resolve, reject) => {
//         DBLocal.query(query, values, (err: QueryError, result: any) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

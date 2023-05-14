import { compose } from "@reduxjs/toolkit";

export const validate = (a,b, c, d) => {
    let error = {
        size: '',
        color: '',
        desc: '',
        img: ''
    }
    const j = a.length;
    const h = b.length;
    const i = d.length;
    if(j === 0 && h===0 && c === '' && d === 0) {
         error = {...error,  
            size: 'Sizes is required',
            color: 'Colors is required',
            desc: 'Description is required',
            img: 'Images is required'
        }
    } 
    if(j===0) {
        error = {...error, size: 'Sizes is required'}
    } 
    
    if(h===0) {
        error = {...error, color: 'Colors is required',}
    }
    if(c === '') {
         error = {...error, desc: 'Description is required'}
    } 
    if(i===0) {
        error = {...error, img: 'Images is required'}
    } 
    if(j !== 0 && h !== 0 && c && d !== 0) {
        error = {...error}
    }
    return error;
}
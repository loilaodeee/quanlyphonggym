import { useEffect } from "react";

function useDocumentTitle(title){
    useEffect(()=>{
        document.title=`${title} | Ariess Fitness`;
    },[title]);
}

export default useDocumentTitle;


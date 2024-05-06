function confirmPassword(){
    const submit = document.querySelector(".submit_B");
    const pass= document.querySelector('#password');
    const repass = document.querySelector('#repassword');
    pass.addEventListener("change",(e)=>{
        repass.setAttribute("pattern",`(${pass.value})`);
    })
}
confirmPassword();
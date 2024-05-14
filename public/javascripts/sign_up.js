const submit = document.querySelector(".submit_B");
const pass= document.querySelector('#password');
const repass = document.querySelector('#repassword');

function confirmPassword(){
    pass.addEventListener("change",(e)=>{
        repass.setAttribute("pattern",`(${pass.value})`);
    })
}

function showPassword(button){
    const box = button.parentNode;
    const input = box.querySelector("input");
    let toggle = ["off","on"];
    button.addEventListener("click",(e)=>{
        if(input.attributes.type.value === "password"){
            toggle = ["off","on"];
            input.setAttribute("type","text");
        }else if(input.attributes.type.value === "text"){
            toggle = ["on","off"];
            input.setAttribute("type","password");
        }
        button.classList.remove(toggle[0]);
        button.classList.add(toggle[1]);
    })
}

function main(){
    confirmPassword();
    const showPass = document.querySelectorAll(".show_pass");
    showPass.forEach(e => {
        showPassword(e);
    });
    
}main();

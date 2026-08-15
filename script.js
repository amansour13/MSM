// login script
let generatedOTP = null;

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email) {
    generatedOTP = generateOTP();

    const templateParams = {
        email: email,
        passcode: generatedOTP
    };

    sessionStorage.setItem("generatedOTP", generatedOTP);

    try {
        const response = await emailjs.send(
            "service_o7a37tf",
            "template_m7qme5c",
            templateParams
        );

        console.log("Email sent:", response.status, response.text);

        return true;
    } catch (error) {
        console.error("Failed to send email:", error);

        return false;
    }
}


function clearCode() {
    document.getElementById("code").value = "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let sendBtn = document.querySelector('.send-btn');
if (sendBtn){
    sendBtn.addEventListener('click', async ()=>{
        let emailInput = document.querySelector('.email-input');
        console.log(emailInput.value)
        
        if (!isValidEmail(emailInput.value)) {
            alert("The email entered isn't valid");
            return;
        }
    
        const success = await sendOTP(emailInput.value);
        
        if (success) {
            window.location.href = "otb.html";
        } else {
            alert("Failed to send OTP. Please try again.");
        }
    })
}

let submitBtn = document.querySelector('.submit-code');
if (submitBtn){
    submitBtn.addEventListener('click', () =>{
        const code = document.getElementById("code").value;
        console.log('hello world')
        if (code == sessionStorage.getItem('generatedOTP')){
            window.location.href = "account.html"
        }
        else{
            alert("the OTP entered isn't correct")
        }
    })
}


// end of login script


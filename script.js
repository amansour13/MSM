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
            sessionStorage.setItem("currentEmail", emailInput.value);
            console.log(sessionStorage.getItem('currentEmail'), 'kkkkk');

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



// account (class)
// data: email, name, balance, lineitems, logs(optional), min_save_point
// methods: add_money(), deduct(), add_line_item(), remove_line_item(), logout()

// line_item (object): has name, price, note


class line_item{
    constructor(name, price, note) {
        this.name = name;
        this.price = price;
        this.note = note
      }
}


class account{
    constructor(email, name, balance=0, min_save_point){
        this.email = email;
        this.name = name;
        this.balance = balance;
        this.lineitems = [new line_item("Item", 5000, 'Ay haga')];
        this.logs = [];
        this.min_save_point = min_save_point;
    }

    add_money(money){
        if (money > 0){
            this.balance += money;
        }
        this.refresh_data()
    }
    
    deduct(money){
        if (money > 0){
            this.balance -= money;
        }
        this.refresh_data()
    }   

    add_line_item(name, price, note){
        let lineitem = new line_item(name, price, note);
        this.lineitems.push(lineitem);
        this.refresh_data()
    }

    remove_line_item(name){
        for(let i = 0; i < this.lineitems.length; i++){
            if (name == this.lineitems[i].name){
                this.lineitems.splice(i, 1);
                break;
            }
        }
        this.refresh_data()
    }

    logout(){
        window.location.href = 'login.html';
    }

    login(){
        this.refresh_data()
    }

    refresh_data(){
        let balance = document.querySelector('.balance-container .money');
        balance.innerHTML = this.balance;
        
        let items = document.querySelector('.purchase-items ul');
        items.innerHTML = '';

        for (let i = 0; i < this.lineitems.length; i++){
            let item = `<li>
            <span class="item-name">${this.lineitems[i].name}</span> 
            <span class="item-price">E£${this.lineitems[i].price}</span> 
            <span class="item-note">${this.lineitems[i].note}</span> 
            </li>`;
            
            items.innerHTML += item;
        }
    }
}

let add_money_btn = document.querySelector('.add-money-btn');

add_money_btn.addEventListener('click', ()=>{
    for (let i = 0; i < testAccounts.length; i++) {
        if (currentEmail === testAccounts[i].email) {
            let money = prompt('How much you need to add?')
            testAccounts[i].add_money(Number(money));
            break;
        }
    }
})

let deduct_btn = document.querySelector('.transactions-btn');

deduct_btn.addEventListener('click', ()=>{
    for (let i = 0; i < testAccounts.length; i++) {
        if (currentEmail === testAccounts[i].email) {
            let money = prompt('How much you need to deduct?')
            testAccounts[i].deduct(Number(money));
            break;
        }
    }
})

let item_btn = document.querySelector('.add-item-btn');

item_btn.addEventListener('click', ()=>{
    for (let i = 0; i < testAccounts.length; i++) {
        if (currentEmail === testAccounts[i].email) {
            let name = prompt("Enter item name:");
            let price = prompt("Enter item price:");
            let note = prompt("Enter item note:");
            testAccounts[i].add_line_item(name, Number(price), note);
            break;
        }
    }
})

let logout_btn = document.querySelector('.logout-btn');

logout_btn.addEventListener('click', ()=>{
    for (let i = 0; i < testAccounts.length; i++) {
        if (currentEmail === testAccounts[i].email) {
            testAccounts[i].logout();
            break;
        }
    }
})



// let item = `<li>
// <span class="item-name">${name}</span> 
// <span class="item-price">E£${price}</span> 
// <span class="item-note">${note}</span> 
// </li>`;

const testAccounts = [
    new account(
        "a.mansour1345@gmail.com",
        "Ahmed",
        5000,
        2000
    ),

    new account(
        "eyad.ahm92011@gmail.com",
        "eyad",
        0,
        1000
    ),

    new account(
        "y12880866@gmail.com",
        "Youssef",
        500,
        1000
    ),

    new account(
        "mariam@example.com",
        "Mariam",
        2500,
        2000
    ),

    new account(
        "omar@example.com",
        "Omar",
        -300,
        1000
    )
];



const modeBtn = document.querySelector('.mode-btn');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

if (modeBtn) {
    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
}

const currentEmail = sessionStorage.getItem("currentEmail");

for (let i = 0; i < testAccounts.length; i++) {
    if (testAccounts[i].email === currentEmail) {
        testAccounts[i].login();
        break;
    }
}

for (let i = 0; i < testAccounts.length; i++) {
    if (testAccounts[i].email === currentEmail) {
        document.querySelector(".money").textContent = testAccounts[i].balance;
        break;
    }
}

// ==== NEW ADDITIONS FOR SAVINGS FEATURE ====

// 1. Add this property inside the account constructor (after this.balance = balance;)
this.savings = 0;

// 2. Add this method inside the account class
save_percentage(percent){
    percent = Number(percent);

    if (isNaN(percent) || percent <= 0 || percent > 100){
        alert("Enter a percentage between 1 and 100");
        return false;
    }

    let amount = this.balance * (percent / 100);

    if (this.balance - amount < this.min_save_point){
        alert(`That would drop your balance below your minimum save point of E£${this.min_save_point}`);
        return false;
    }

    this.balance -= amount;
    this.savings += amount;
    this.refresh_data();
    return true;
}

// 3. Add these lines inside refresh_data(), right after the balance.innerHTML line
let savingsEl = document.querySelector('.savings-container .money');
if (savingsEl){
    savingsEl.innerHTML = this.savings;
}

// 4. Add this button listener anywhere near your other button listeners (outside the class)
let savings_btn = document.querySelector('.savings-btn');

if (savings_btn){
    savings_btn.addEventListener('click', ()=>{
        let percent = prompt("What percentage of your balance do you want to save?");
        if (percent === null) return; // user hit cancel

        for (let i = 0; i < testAccounts.length; i++) {
            if (currentEmail === testAccounts[i].email) {
                testAccounts[i].save_percentage(percent);
                break;
            }
        }
    })
}

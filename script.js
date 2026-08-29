const SUPABASE_URL = "https://crvcdoplhrfqyajntlqu.supabase.co";
const SUPABASE_KEY = "sb_publishable_q3F5FWeC1FjcCEI-vM6gPw_GmBzY5KP";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let generatedOTP = null;

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


//function generateOTP() {
//    return Math.floor(100000 + Math.random() * 900000).toString();
//}

async function sendOTP(email) {
    generatedOTP = generateOTP();
    console.log(generatedOTP);
    
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
    const code = document.getElementById("code");
    if (code) {
        code.value = "";
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let sendBtn = document.querySelector('.send-btn');

if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
        let emailInput = document.querySelector('.email-input');

        if (!emailInput) {
            return;
        }

        console.log(emailInput.value);

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
    });
}

let submitBtn = document.querySelector('.submit-code');

if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const codeElement = document.getElementById("code");

        if (!codeElement) {
            return;
        }

        const code = codeElement.value;
        console.log('hello world');

        if (code == sessionStorage.getItem('generatedOTP')) {
            window.location.href = "account.html";
        } else {
            alert("the OTP entered isn't correct");
        }
    });
}

class line_item {
    constructor(name, price, note) {
        this.name = name;
        this.price = price;
        this.note = note;
    }
}

class account {
    constructor(id, email, name, balance = 0, min_save_point = 0, savings = 0) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.balance = Number(balance) || 0;
        this.lineitems = [];
        this.logs = [];
        this.min_save_point = Number(min_save_point) || 0;
        this.savings = Number(savings) || 0;
    }

    async load() {
        const { data, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("email", this.email)
            .single();

        if (error) {
            console.error("Error loading account:", error);
            alert("Could not load your account.");
            return false;
        }

        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.balance = Number(data.balance) || 0;
        this.min_save_point = Number(data.min_save_point) || 0;
        this.savings = Number(data.savings) || 0;
        this.logs = Array.isArray(data.logs) ? data.logs : [];

        if (Array.isArray(data.lineitems)) {
            this.lineitems = data.lineitems.map(item => {
                return new line_item(
                    item.name,
                    Number(item.price) || 0,
                    item.note || ""
                );
            });
        } else {
            this.lineitems = [];
        }

        this.refresh_data();

        return true;
    }

    async add_money(money) {
        money = Number(money);

        if (isNaN(money) || money <= 0) {
            return false;
        }

        this.balance += money;

        return await this.refresh_data();
    }

    async deduct(money) {
        money = Number(money);

        if (isNaN(money) || money <= 0) {
            return false;
        }

        if (this.balance - money < this.min_save_point) {
            alert(`That would drop your balance below your minimum save point of E£${this.min_save_point}`);
            return false;
        }

        this.balance -= money;

        return await this.refresh_data();
    }

    async add_line_item(name, price, note) {
        price = Number(price);

        if (!name || isNaN(price) || price < 0) {
            return false;
        }

        let lineitem = new line_item(name, price, note || "");
        this.lineitems.push(lineitem);

        return await this.refresh_data();
    }

    async remove_line_item(name) {
        for (let i = 0; i < this.lineitems.length; i++) {
            if (name == this.lineitems[i].name) {
                this.lineitems.splice(i, 1);
                break;
            }
        }

        return await this.refresh_data();
    }

    async save_percentage(percent) {
        percent = Number(percent);

        if (isNaN(percent) || percent <= 0 || percent > 100) {
            alert("Enter a percentage between 1 and 100");
            return false;
        }

        let amount = this.balance * (percent / 100);

        if (this.balance - amount < this.min_save_point) {
            alert(`That would drop your balance below your minimum save point of E£${this.min_save_point}`);
            return false;
        }

        this.balance -= amount;
        this.savings += amount;

        return await this.refresh_data();
    }

    async refresh_data() {
        const balance = document.querySelector('.balance-container .money');

        if (balance) {
            balance.innerHTML = this.balance;
        }

        const savingsEl = document.querySelector('.savings-container .money');

        if (savingsEl) {
            savingsEl.innerHTML = this.savings;
        }

        const items = document.querySelector('.purchase-items ul');

        if (items) {
            items.innerHTML = '';

            for (let i = 0; i < this.lineitems.length; i++) {
                let item = `<li>
                <span class="item-name">${this.lineitems[i].name}</span> 
                <span class="item-price">E£${this.lineitems[i].price}</span> 
                <span class="item-note">${this.lineitems[i].note}</span> 
                </li>`;

                items.innerHTML += item;
            }
        }

        if (!this.id) {
            return false;
        }

        const { error } = await supabase
            .from("accounts")
            .update({
                name: this.name,
                balance: this.balance,
                savings: this.savings,
                min_save_point: this.min_save_point,
                lineitems: this.lineitems,
                logs: this.logs
            })
            .eq("id", this.id);

        if (error) {
            console.error("Error saving account:", error);
            return false;
        }

        return true;
    }

    logout() {
        sessionStorage.removeItem("currentEmail");
        sessionStorage.removeItem("generatedOTP");
        window.location.href = 'login.html';
    }

    login() {
        this.refresh_data();
    }
}

let currentAccount = null;
const currentEmail = sessionStorage.getItem("currentEmail");

async function loadCurrentAccount() {
    if (!currentEmail) {
        window.location.href = "login.html";
        return;
    }

    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("email", currentEmail)
        .single();

    if (error) {
        console.error("Error loading account:", error);
        alert("Could not load your account.");
        return;
    }

    currentAccount = new account(
        data.id,
        data.email,
        data.name,
        data.balance,
        data.min_save_point,
        data.savings
    );

    currentAccount.lineitems = Array.isArray(data.lineitems)
        ? data.lineitems.map(item => {
            return new line_item(
                item.name,
                Number(item.price) || 0,
                item.note || ""
            );
        })
        : [];

    currentAccount.logs = Array.isArray(data.logs) ? data.logs : [];

    currentAccount.refresh_data();
}

let add_money_btn = document.querySelector('.add-money-btn');

if (add_money_btn) {
    add_money_btn.addEventListener('click', async () => {
        if (!currentAccount) {
            return;
        }

        let money = prompt('How much you need to add?');

        if (money === null) {
            return;
        }

        await currentAccount.add_money(money);
    });
}

let deduct_btn = document.querySelector('.transactions-btn');

if (deduct_btn) {
    deduct_btn.addEventListener('click', async () => {
        if (!currentAccount) {
            return;
        }

        let money = prompt('How much you need to deduct?');

        if (money === null) {
            return;
        }

        await currentAccount.deduct(money);
    });
}

let item_btn = document.querySelector('.add-item-btn');

if (item_btn) {
    item_btn.addEventListener('click', async () => {
        if (!currentAccount) {
            return;
        }

        let name = prompt("Enter item name:");

        if (name === null) {
            return;
        }

        let price = prompt("Enter item price:");

        if (price === null) {
            return;
        }

        let note = prompt("Enter item note:");

        if (note === null) {
            return;
        }

        await currentAccount.add_line_item(
            name,
            Number(price),
            note
        );
    });
}

let savings_btn = document.querySelector('.savings-btn');

if (savings_btn) {
    savings_btn.addEventListener('click', async () => {
        if (!currentAccount) {
            return;
        }

        let percent = prompt("What percentage of your balance do you want to save?");

        if (percent === null) {
            return;
        }

        await currentAccount.save_percentage(percent);
    });
}

let logout_btn = document.querySelector('.logout-btn');

if (logout_btn) {
    logout_btn.addEventListener('click', () => {
        if (!currentAccount) {
            window.location.href = 'login.html';
            return;
        }

        currentAccount.logout();
    });
}

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

if (document.querySelector('.balance-container') || document.querySelector('.purchase-items')) {
    loadCurrentAccount();
}

// ==== NEW ADDITIONS FOR SAVINGS FEATURE ====

// 1. Add this property inside the account constructor (after this.balance = balance;)
// this.savings = 0;

// // 2. Add this method inside the account class
// save_percentage(percent){
//     percent = Number(percent);

//     if (isNaN(percent) || percent <= 0 || percent > 100){
//         alert("Enter a percentage between 1 and 100");
//         return false;
//     }

//     let amount = this.balance * (percent / 100);

//     if (this.balance - amount < this.min_save_point){
//         alert(`That would drop your balance below your minimum save point of E£${this.min_save_point}`);
//         return false;
//     }

//     this.balance -= amount;
//     this.savings += amount;
//     this.refresh_data();
//     return true;
// }

// // 3. Add these lines inside refresh_data(), right after the balance.innerHTML line
// let savingsEl = document.querySelector('.savings-container .money');
// if (savingsEl){
//     savingsEl.innerHTML = this.savings;
// }

// // 4. Add this button listener anywhere near your other button listeners (outside the class)
// let savings_btn = document.querySelector('.savings-btn');

// if (savings_btn){
//     savings_btn.addEventListener('click', ()=>{
//         let percent = prompt("What percentage of your balance do you want to save?");
//         if (percent === null) return; // user hit cancel

//         for (let i = 0; i < testAccounts.length; i++) {
//             if (currentEmail === testAccounts[i].email) {
//                 testAccounts[i].save_percentage(percent);
//                 break;
//             }
//         }
//     })
// }

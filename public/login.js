const signupbtn = document.getElementById('signup');

signupbtn.addEventListener('click', async event => {
  window.location.href="./signup.html"
})

const loginForm = document.getElementById('login-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/user/login', {
      email: email.value,
      password: password.value
    });
    const isPremium = response.data.isPremium;
    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('isPremium', isPremium);
    window.location.href = "http://localhost:3000/expense.html";
    
  } catch (error) {
    console.error(error);
  }
});

function forgotpassword() {
  window.location.href = "../forgotpassword.html"
}


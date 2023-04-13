
const token = localStorage.getItem('token');
function addNewExpense(e){
    e.preventDefault()
    const form = new FormData(e.target);
    console.log(e);
    console.log(form);
    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")

    }
    console.log(expenseDetails)
    axios.post('http://16.16.110.189:3000/user/addexpense',expenseDetails, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 201){
        addNewExpensetoUI(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }

    }).catch(err => showError(err))

}

function addNewLeader(leader) {
    const pElement = document.getElementById('leaderboard');
    pElement.innerHTML += `
    <li>
        ${leader.name} - ${leader.amount}
    </li>`
    }

function showLeaderBoard() {
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    leaderboardBtn.style.display = 'block';
    leaderboardBtn.addEventListener('click', async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://16.16.110.189:3000/purchase/leaderboard', {headers: {"Authorization": token}}); 
        console.log(response.data);

        // Create an unordered list element to display the data
        const leaderboardList = document.createElement('ul');

        // Loop through the response data and create a list item for each object
        response.data.forEach(obj => {
        const listItem = document.createElement('li');
        listItem.textContent = `${obj.name}: $${obj.totalExpense}`;
        leaderboardList.appendChild(listItem);
        });

        // Display the list in the leaderboard container
        const leaderboardContainer = document.getElementById('leaderboard-container');
        leaderboardContainer.innerHTML = '';
        leaderboardContainer.appendChild(leaderboardList);
        leaderboardContainer.style.display = 'block';

        } catch(err) {
        throw new Error(err);
        }
    });
    }

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
    }

window.addEventListener('load', ()=> {
    const token = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    const isPremium = decodeToken.isPremium;
    console.log(token)
    if(isPremium) {
        showPremium();
        showLeaderBoard();
    }

    const limitSelect = document.getElementById('limit');
       
    limitSelect.addEventListener('change', () => {
        limit = parseInt(limitSelect.value);
        currentPage = 1; // Reset the current page to 1 when the limit value changes
        localStorage.setItem('limit', limit);
        fetchExpenses();
      });

      const savedLimit = localStorage.getItem('limit');
      if (savedLimit) {
        limitSelect.value = savedLimit;
      }

      let limit = limitSelect.value;

    const fetchExpenses = async (page) => {
        try {
        const response = await axios.get(`http://16.16.110.189:3000/user/expenses?page=${page}&limit=${limit}`, {
            headers: {
            Authorization: localStorage.getItem('token'),
            },
        });
    
        const data = response.data;
        const expensesTableBody = document.getElementById('expenses-table-body');
        const paginationButtons = document.getElementById('pagination-buttons');
        // Clear the previous table rows
        expensesTableBody.innerHTML = '';
    
        // Add the new table rows for the fetched expenses
        for (const expense of data.expenses) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${expense.expenseamount}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
            `;
            expensesTableBody.appendChild(row);
        }
    
        // Update the pagination buttons
        paginationButtons.innerHTML = '';
        for (let i = 1; i <= data.totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === data.currentPage) {
            button.disabled = true;
            } else {
            button.addEventListener('click', () => fetchExpenses(i));
            }
            paginationButtons.appendChild(button);
        }
        } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again later.');
        }
    };
    
    // Fetch the first page of expenses when the page loads
    fetchExpenses(1);
});

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    axios.delete(`http://16.16.110.189:3000/user/deleteexpense/${expenseid}`, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 204){
            removeExpensefromUI(expenseid);
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function showPremium() {
    const button = document.getElementById('razor-pay-btn');
    button.style.display = 'none';
    document.getElementById('premium-text').style.display = 'block';
    }

document.getElementById('razor-pay-btn').onclick = async function (e) {
    const response  = await axios.get('http://16.16.110.189:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "7003442036"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://16.16.110.189:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
             const button = document.getElementById('razor-pay-btn');
             button.style.display = 'none';
             document.getElementById('premium-text').style.display = 'block';
             showLeaderBoard();
             
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.description);
 });
}


document.getElementById('download-yearly-report').onclick = async function (e) {
        axios.get('http://16.16.110.189:3000/user/download', { headers: {"Authorization" : token} })
        .then((response) => {
            if(response.status === 201){
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }
    
        })
        .catch((err) => {
            showError(err)
        });
    }

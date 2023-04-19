const config = {
    headers: {
        'content-type': 'application/json'
    }
};

let skip = 0;

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-me')) {
        let userInput = prompt('Enter your todo text!');

        if (userInput) {
            let body = JSON.stringify({
                id: event.target.getAttribute('data-id'),
                newData: { todo: userInput }
            });

            try {
                const res = await axios.post('/edit-item', body, config);
                if (res.status === 200) {
                    event.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
                    alert('Updated successfully!');
                } else {
                    alert('updation failed');
                }
            } catch (err) {
                alert('updation failed with error');
            }
        }
    }
    if (event.target.classList.contains('delete-me')) {


        try {
            const res = await axios.delete('/delete-item' + `/${event.target.getAttribute('data-id')}`);

            if (res.status === 200) {
                event.target.parentElement.parentElement.remove();
                alert('delete successfully');
            } else {
                alert('deletion failed');
            }
        } catch (err) {
            alert('failed deletion with error');
        }

    }


});

document.getElementById('show_more').addEventListener('click', (event) => {
    axios.post(`/pagination-dashboard?skip=${skip}`, JSON.stringify({}), config).then((res) => {
        if (res.status !== 200) {
            alert('Somethin wrong happened error');
            return;
        }
        const outputRes = res?.data?.data[0]?.data;

        document.getElementById('item-list').insertAdjacentHTML('beforeend', outputRes.map((todo) => {
            return `<li>
                <span class="item-text">
                    ${todo.todo}
                </span>
                <div style="display: flex;flex-direction: row;align-items: center">
                    <button data-id=${todo._id} class="edit-me"
                        style="padding: 5px;color: #fff;background-color: green;margin: 5px;cursor: pointer;">edit</button>
                    <button class="delete-me" data-id=${todo._id} style="padding: 5px;color: #fff;background-color: red;margin: 5px;cursor:
                        pointer;">delete</button>
                </div>
            </li>`;
        }).join(''));

        skip += outputRes.length;
    }).catch((err) => {
        alert('Not able to fetch todos please try again', err);
        return;
    });
});

window.onload = function () {
    axios.post(`/pagination-dashboard?skip=${skip}`, JSON.stringify({}), config).then((res) => {
        if (res.status !== 200) {
            alert('Somethin wrong happened error');
            return;
        }
        const outputRes = res?.data?.data[0]?.data;

        document.getElementById('item-list').insertAdjacentHTML('beforeend', outputRes.map((todo) => {
            return `<li>
                <span class="item-text">
                    ${todo.todo}
                </span>
                <div style="display: flex;flex-direction: row;align-items: center">
                    <button data-id=${todo._id} class="edit-me"
                        style="padding: 5px;color: #fff;background-color: green;margin: 5px;cursor: pointer;">edit</button>
                    <button class="delete-me" data-id=${todo._id} style="padding: 5px;color: #fff;background-color: red;margin: 5px;cursor:
                        pointer;">delete</button>
                </div>
            </li>`;
        }).join(''));

        skip += outputRes.length;
    }).catch((err) => {
        alert('Not able to fetch todos please try again', err);
        return;
    });
};

document.querySelector('#click-me').addEventListener('click', (event) => {

    event.preventDefault();

    const todoText = document.querySelector('#todo').value;

    axios.post('/create-item', JSON.stringify({ todo: todoText }), config).then((res) => {
        console.log('res', res);
        todoText.value = "";
    }).catch((err) => {
        console.log(err);
    });
});

// document.querySelector('#logout-all').addEventListener('click', (event) => {

//     event.preventDefault();

//     axios.post('/logout_from_all_devices', JSON.stringify({ todo: todoText }), config);
// });

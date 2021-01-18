const createOtherDoc = items => {
    let list = '';
    for (const item of items) {
        list += `<option value="">${item}</option>`
    }

    return `<div class="value" data-label="email">
        <select name="" id="" disabled="true">
            ${list}
        </select>
        <div class="btn-edit visible">
            <i class="fas fa-edit"></i>
        </div>
        <div class="btn-save">
            <i class="fas fa-save"></i>
        </div>
        <div class="btn-del">
            <i class="fas fa-trash"></i>
        </div>
    </div>`
};

(async () => {
    await pageload();

    const photoElement = document.querySelector('.photo > .img');

    photoElement.style.backgroundImage = 'url("https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/4af3e5d8-3352-49bd-9570-de2aef8972b9/eric-bailey-profile.jpg")';

    const editBtns = document.querySelectorAll('.btn-edit');
    const saveBtns = document.querySelectorAll('.btn-save');
    const delBtns = document.querySelectorAll('.btn-del');
    const addBtn = document.querySelector('.others-add');

    for (const editBtn of editBtns) {
        editBtn.onclick = () => {
            const p = editBtn.parentElement;
            
            const input = p.querySelector('input, select')
            const prevValue = input.value;

            editBtn.classList.remove('visible')
            p.querySelector('.btn-save').classList.add('visible');
            try {
                p.querySelector('.btn-del').classList.add('visible');
            } catch(e) {}
            try {
                p.querySelector('.btn-undo').classList.add('visible');
            } catch(e) {}

            input.disabled = false;
            input.select();

            p.classList.add('edit');

            const undoBtn = p.querySelector('.btn-undo');
            undoBtn.onclick = () => {
                input.value = prevValue;

                p.querySelector('.btn-edit').classList.add('visible');
                p.querySelector('.btn-save').classList.remove('visible');
                try {
                    p.querySelector('.btn-del').classList.remove('visible');
                } catch(e) {}
                try {
                    p.querySelector('.btn-undo').classList.remove('visible');
                } catch(e) {}

                p.classList.remove('edit');
            };
        };
    }
    for (const saveBtn of saveBtns) {
        saveBtn.onclick = () => {
            const p = saveBtn.parentElement;

            saveBtn.classList.remove('visible')
            p.querySelector('.btn-edit').classList.add('visible');
            try {
                p.querySelector('.btn-del').classList.remove('visible');
            } catch(e) {}
            try {
                p.querySelector('.btn-undo').classList.remove('visible');
            } catch(e) {}

            p.querySelector('input, select').disabled = true;
            p.classList.remove('edit');
        };
    }
    for (const delBtn of delBtns) {
        delBtn.onclick = () => {
            delBtn.parentElement.remove();
        };
    }

    let x = 0;
    addBtn.onclick = () => {
        const newDocStr = createOtherDoc(['test' + x++]);
        const div = document.createElement('div');

        div.innerHTML = newDocStr.trim();

        const p = div.firstChild;

        const editBtn = p.querySelector('.btn-edit');
        const saveBtn = p.querySelector('.btn-save');
        const delBtn = p.querySelector('.btn-del');

        editBtn.onclick =  () => {
            const p = editBtn.parentElement;

            editBtn.classList.remove('visible')
            p.querySelector('.btn-save').classList.add('visible');
            try {
                p.querySelector('.btn-del').classList.add('visible');
            } catch(e) {}
            try {
                p.querySelector('.btn-undo').classList.add('visible');
            } catch(e) {}

            p.querySelector('input, select').disabled = false;
            p.classList.add('edit');
        };

        saveBtn.onclick = () => {
            const p = saveBtn.parentElement;

            saveBtn.classList.remove('visible')
            p.querySelector('.btn-del').classList.remove('visible');
            try {
                p.querySelector('.btn-edit').classList.add('visible');
            } catch(e) {}
            try {
                p.querySelector('.btn-undo').classList.add('visible');
            } catch(e) {}

            p.querySelector('input, select').disabled = true;
            p.classList.remove('edit');
        };

        delBtn.onclick = () => {
            delBtn.parentElement.remove();
        };

        addBtn.parentNode.insertBefore(div.firstChild, addBtn);
    };
})();
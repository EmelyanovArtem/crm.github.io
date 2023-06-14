(() => {
class createElement {
    constructor(obj) {
        this.tagName = obj.tagname;
        this.Classes = obj.class ? obj.class : null;
        this.attr = obj.attr ? obj.attr : null;
        this.text = obj.text ? obj.text : null;
        this.element = this.addtagName();
        this.addClass(this.element);
        this.addText(this.element, this.text);
        this.addAttr(this.element);
    }
    addtagName() {
        return document.createElement(this.tagName);
    }
    addClass(Element) {
        if (this.Classes) {
            let arrayClass = this.Classes.split(" ");
            if (Array.isArray(arrayClass)) {
                arrayClass.forEach(el => Element.classList.add(el));
            } else {
                Element.classList.add(arrayClass)
            }
        }
    }
    addText(Element, text) {
        Element.textContent = text;
    }
    addAttr(Element) {
        if (this.attr) {
            let keys = Object.entries(this.attr);
            keys.forEach(el => {
                Element.setAttribute(el[0], el[1]);
            })
        }
    }
    getElement() {
        return this.element;
    }
    append(newElement) {
        this.element.append(newElement);
    }
}

let allTr = [];
let allClients = []

function createdElement(obj, newElement) {
    let el = new createElement(obj);
    if (newElement) {
        if (Array.isArray(newElement)) {
            for (let i = 0; i < newElement.length; i++) {
                el.append(newElement[i]);
            };
        } else {
            el.append(newElement);
        }     
    }
    return el.getElement();
}

function validator(modal, check) {

    const validator = new JustValidate('#formAdd');

        validator
        .addField('#inputName', [
            {
            rule: 'required',
            errorMessage: 'Поле "Имя" обязательно для заполнения'
            }
        ], {
            errorsContainer: '#errors-container'
        })
        .addField('#inputSurName', [
            {
            rule: 'required',
            errorMessage: 'Поле "Фамилия" обязательно для заполнения'
            }
        ], {
            errorsContainer: '#errors-container'
        })

        validator.onSuccess(e => {
            e.preventDefault();

            const data = getData(inputName, inputSurName, inputLastName, modal.contacts);
            console.log(data);

                if (modal.checker === 'add') {
                    onSave(data, modal.modalElement, modal.checker)
                };
                if (modal.checker === 'edit') {
                    onSave(modal.client, modal.modalElement, modal.checker, data)
                };
        })
    
    return validator
}

function getData(inputName, inputSurname, inputLastName, contacts) {
    const data = {
        name: inputName.value,
        surname: inputSurname.value,
        lastName: inputLastName.value,
        contacts: contacts,
    };

    return data;
}

// Ф-ция создания столбца с контактами

function createIdTd(client) {
    if (Array.isArray(client)) {
        return;
    } else {
        const id = document.createElement('td');
        id.classList.add('tbody__td');
        id.classList.add('grey-td');
        id.textContent = client.id;
    
        return id;
    }  
}

function createFioTd(client) {
    if (Array.isArray(client)) {
        return;
    } else{
        const fio = document.createElement('td');
        fio.classList.add('tbody__td');
        fio.classList.add('tbody__td--fio');
        fio.textContent = `${client.surname} ${client.name} ${client.lastName}`; 

        return fio;
    }
}

function getDateValue(client, typeTime) {
    if (typeTime === 'created') {
        const createdDate = ('0' + new Date(client.createdAt).getDate()).slice(-2) + '.'
        + ('0' + (new Date(client.createdAt).getMonth() + 1)).slice(-2) + '.' 
        + new Date(client.createdAt).getFullYear();

        const createdTime = `${new Date(client.createdAt).getHours()}:${new Date(client.createdAt).getMinutes()}`;

        const createdTimeArr = [createdDate, createdTime];

        return createdTimeArr;
    } else {
        const updatedDate = ('0' + new Date(client.updatedAt).getDate()).slice(-2) + '.'
        + ('0' + (new Date(client.updatedAt).getMonth() + 1)).slice(-2) + '.' 
        + new Date(client.updatedAt).getFullYear();

        const updatedTime = `${new Date(client.updatedAt).getHours()}:${new Date(client.updatedAt).getMinutes()}`;

        const updatedTimeArr = [updatedDate, updatedTime];

        return updatedTimeArr;
    }
}

function createDateTd(arrValues) {
    const dateTd = document.createElement('td');
    dateTd.classList.add('tbody__td');

    const dateCreate = document.createElement('span');
    dateCreate.classList.add('date-create');
    dateCreate.textContent = arrValues[0];
    
    const greyDate = document.createElement('span');
    greyDate.classList.add('grey-text');
    greyDate.textContent = arrValues[1];

    dateTd.append(dateCreate);
    dateTd.append(greyDate);
    
    return dateTd;
}

function createContactTd(contactArr) {
    const wrapper = document.createElement('td');
    wrapper.classList.add('tbody__td');
    wrapper.classList.add('tbody__td--contacts');

    // console.log(typeof contactArr, contactArr, /*contactArr.lenght*/ Object.keys(contactArr).length);
    for (let i = 0; i < Object.keys(contactArr).length; i++) {

        const contact = document.createElement('div');
        contact.classList.add('contact-img');

        switch(contactArr[i].type){
            case 'VK':
                contact.classList.add('contact-img--vk');
                break;
            case 'phone':
                contact.classList.add('contact-img--phone');
                break;
            case 'DopPhone':
                contact.classList.add('contact-img--DopPhone');
                break;
            case 'email':
                contact.classList.add('contact-img--email');
                break;
            case 'facebook':
                contact.classList.add('contact-img--facebook');
                break;
            default:
                contact.classList.add('contact-img--default');
                break
        }

        const textWrapper = document.createElement('div');
        textWrapper.classList.add('contact-text-wrapper');

        const contactTypeText = document.createElement('span');
        contactTypeText.innerText = contactArr[i].type;
        contactTypeText.classList.add('contact-type-text');

        const contactText = document.createElement('span');
        contactText.innerText = contactArr[i].value;
        contactText.classList.add('contact-type-text')
        contactText.classList.add('contact-type-text--purple')

        textWrapper.append(contactTypeText);
        textWrapper.append(contactText);

        contact.append(textWrapper);

        // if (contactArr[i].type === 'another') {
        //     tippy(contact, {
        //         content: `${}`
        //     })
        // } else {

        let type = '';
        if (contactArr[i].type == 'phone') {
            type = 'Телефон';
        } else if(contactArr[i].type == 'DopPhone') {
            type = 'Дополнительный телефон';
        } else if(contactArr[i].type == 'email') {
            type = 'Емэил';
        } else if(contactArr[i].type == 'VK') {
            type = 'ВК';
        } else if(contactArr[i].type == 'facebook') {
            type = 'Фейсбук';
        } else {
            type = 'Другое';
        }

        tippy(contact, {
            content: `${type}: ${contactArr[i].value}`,
        });
        // }

        wrapper.append(contact);
    }
    return wrapper;
}

function createButtonsWrapper(updateBtn, deleteBtn) {
    const wrapper = document.createElement('td');
    wrapper.classList.add('tbody__td');
    wrapper.append(updateBtn);
    wrapper.append(deleteBtn);

    return wrapper;
}

function createUpdateBtn(client) {
    const btn = document.createElement('div');
    // btn.classList.add('tbody__td');
    btn.classList.add('client-btn');
    btn.classList.add('client-btn--edit');
    btn.textContent = 'Изменить';

    btn.addEventListener('click', async () => {
        overlay.classList.add('overlay--active');
        const modal = createModalWithForm(client, {onSave, onClose}, 'Изменить данные');
        document.body.append(
            modal.modalElement
        );
    });

    return btn;
}

function createDeleteBtn(client) {
    const btn = document.createElement('div');
    // btn.classList.add('tbody__td');
    btn.classList.add('client-btn');
    btn.classList.add('client-btn--delete');
    btn.textContent = 'Удалить';

    btn.addEventListener('click', () => {
        overlay.classList.add('overlay--active');
        document.body.append(
            createDeleteModal(client, {onSave, onClose})
        );
    });

    return btn;
}

function createTr(id, fio, dateCreate, dateUpdate, contacts, buttons) {
    const tr = document.createElement('tr');
    tr.classList.add('tbody__tr');

    tr.append(id);
    tr.append(fio);
    tr.append(dateCreate);
    tr.append(dateUpdate);
    tr.append(contacts);
    tr.append(buttons);

    return tr;
}

function createDeleteModal(client, {onSave, onClose}) {
    const cancelBtn = createdElement({
        tagname: "button",
        class: "addClient__cancel-btn",
        text: "Отмена"
    });

    const deleteBtn = createdElement({
        tagname: "input",
        attr: {
            type: "submit",
            value: "Удалить",
        },
        class: "addClient__submit"
    });

    const text = createdElement({
        tagname: "p",
        text: "Вы действительно хотите удалить данного клиента?",
        class: "delete-text"
    });

    const title = createdElement({
        tagname: "h2",
        class: "subtitle",
        text: "Удалить клиента"
    });

    const modalElements = [title, text, deleteBtn, cancelBtn];

    const modal = createdElement({
        tagname: "form",
        class: "delete-form",
    }, modalElements);

    modal.addEventListener('submit', async e => {
        e.preventDefault();

        preloader.classList.remove('prelodader--disabled');

        const response = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
            method: "DELETE",
            headers: {'Content-type': 'application/json'}
        });

        const responsee = await fetch('http://localhost:3000/api/clients');
        const listClients = await responsee.json();

        preloader.classList.add('prelodader--disabled');

        removeAllClients(allTr);    
        addAllClients(listClients);

        overlay.classList.remove('overlay--active');
        modal.remove();
    });
    cancelBtn.addEventListener('click', e => {
        overlay.classList.remove('overlay--active');
        modal.remove();
    })

    return modal;
}

function createModalWithForm(client, { onSave, onClose }, title) {
    let checker = 'add';
    let contacts = [];

    const addContactBtn = createdElement({
        tagname: "button",
        class: "addClient__btn-contact",
        text: "Добавить контакт"
    });

    const error = createdElement({
        tagname: 'span',
        text: 'Все поля должны быть заполнены',
        class: 'contact-error'
    })

    const contactContent = [addContactBtn, error]

    const selectWrapper = createdElement({
        tagname: "div",
        class: "addClient--grey-bg"
    }, contactContent);
    selectWrapper.id = 'selectWrapper';

    let contactsContent = [];
    let countContacts = 0 

    function createContact(type, value) {
        const input = createdElement({
            tagname: "input",
            class: "select__input",
            attr: {
                placeholder: "Введите данные контакта"
            }
        })
        if (value) input.value = value;
        input.id = 'contact-input';

        let countSimbols = 1;
        input.addEventListener('input', () => {
            countSimbols++;
            console.log(countSimbols)
        })

        let mask = new Inputmask('8 (999) 999-999-99')
        mask.mask(input);

        const optionPhone = createdElement({
            tagname: "option",
            text: "Телефон",
            class: "addClient__option",
            attr: {
                value: "phone"
            }
        })
        const optionDopPhone = createdElement({
            tagname: "option",
            text: "Доп. телефон",
            class: "addClient__option",
            attr: {
                value: "DopPhone"
            }
        })
        const optionEmail = createdElement({
            tagname: "option",
            text: "Email",
            class: "addClient__option",
            attr: {
                value: "email"
            }
        })
        const optionVK = createdElement({
            tagname: "option",
            text: "VK",
            class: "addClient__option",
            attr: {
                value: "VK"
            }
        })
        const optionFacebook = createdElement({
            tagname: "option",
            text: "Facebook",
            class: "addClient__option",
            attr: {
                value: "facebook"
            }
        })
        const optionAnother = createdElement({
            tagname: "option",
            text: "Другое",
            class: "addClient__option",
            attr: {
                value: "another"
            }
        })
    
        const allOption = [optionPhone, optionDopPhone, optionEmail, optionVK, optionFacebook, optionAnother];

        const select = createdElement({
            tagname: "select",
            class: "addClient__select",
        }, allOption)
        if (type) select.value = type;

        select.addEventListener('change', () => {
            switch (select.value) {
                case 'phone':
                    console.log('phone');
                    let maskPhone = new Inputmask('8 (999) 999-999-99')
                    maskPhone.mask(input);
                    break;

                case 'DopPhone' :
                    console.log('dopphone');
                    let maskDopPhone = new Inputmask('8 (999) 999-999-99')
                    maskDopPhone.mask(input);
                    break;

                case 'email' :
                    console.log('email');
                    let maskEmail = new Inputmask('email')
                    maskEmail.mask(input);
                    break;

                case 'VK' :
                    console.log('vk');
                    let maskVK = new Inputmask(`https://vk.com/*{1,20}`)
                    maskVK.mask(input);
                    break;

                case 'facebook' :
                    console.log('facebook');
                    let maskFacebook = new Inputmask('https://fаcebook.com/*{1,20}')
                    maskFacebook.mask(input);
                    break;
            
                default:
                    let maskAnother = new Inputmask('*{1,30}')
                    maskAnother.mask(input);
                    break;
            }
        })

        const deleteContact = createdElement({
            tagname: "div",
            class: "delete-contact-btn"
        })

        const content = [select, input, deleteContact];

        let checker = true;

        deleteContact.addEventListener('click', () => {
            contactWrapper.remove();
            checker = false;
            console.log(contactsContent.indexOf(content));
            contactsContent.splice(contactsContent.indexOf(content), 1);

            countContacts--;

            if (countContacts < 10) {
                addContactBtn.classList.remove('addClient__btn-contact--disable');
                addContactBtn.disabled = false;
            }
        })
    
        var contactWrapper = createdElement({
            tagname: "div",
            class: "addClient__select-wrapper flex",
        }, content);
        contactWrapper.id = 'contact'

        selectWrapper.append(contactWrapper);
        if (checker) contactsContent.push(content);
    }

    addContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createContact();
        countContacts++;

        console.log(countContacts);

        if (countContacts >= 10) {
            addContactBtn.classList.add('addClient__btn-contact--disable');
            addContactBtn.disabled = true;
        }
    })
    
    const inputLastName = createdElement({
        tagname: "input",
        class: "addClient__FIO input",
        attr: {
            placeholder: "Отчество"
        }
    });
    inputLastName.id = 'inputLastName';
    
    const inputName = createdElement({
        tagname: "input",
        class: "addClient__FIO input",
        attr: {
            placeholder: "Имя"
        },
    });
    inputName.id = 'inputName';

    const inputSurName = createdElement({
        tagname: "input",
        class: "addClient__FIO input",
        attr: {
            placeholder: "Фамилия"
        }
    });
    inputSurName.id = 'inputSurName';

    const inputSubmit = createdElement({
        tagname: "input",
        class: "addClient__submit",
        attr: {
            type: "submit",
            value: "Сохранить"
        }
    });

    if (Object.entries(client).length !== 0) {
        inputName.value = client.name;
        inputSurName.value = client.surname;
        inputLastName.value = client.lastName;
        let contacts = client.contacts;
        for (let i = 0; i < contacts.length; i++) {
            createContact(contacts[i].type, contacts[i].value);
        }
        checker = 'edit'
        if (contacts.length >= 10) {
            addContactBtn.classList.add('addClient__btn-contact--disable');
            // addContactBtn.removeEventListener('click', test);
            addContactBtn.disabled = true;
        }
    };

    const FIOinputArr = [inputSurName, inputName, inputLastName]
    
    const inputWrapper = createdElement({
        tagname: 'div',
    }, FIOinputArr)
    inputWrapper.id = 'input-fio-wrapper'

    const errorsContainer = createdElement({
        tagname: 'div',
        class: 'errors-container'
    })
    errorsContainer.id = 'errors-container'

    let inputArr = []

    if (checker === 'add') {
        const cancelButton = createdElement({
            tagname: "button",
            class: "addClient__cancel-btn",
            text: "Отмена"
        });

        cancelButton.addEventListener('click', () => {
            onClose(modalElement)
        });

        inputArr = [inputWrapper, selectWrapper, errorsContainer, inputSubmit, cancelButton]
    } else {
        const deleteButton = createdElement({
            tagname: "button",
            class: "addClient__cancel-btn",
            text: "Удалить клиента"
        });

        deleteButton.addEventListener('click', e => {
            e.preventDefault()
            console.log('it word')

            document.body.append(createDeleteModal(client, {onSave, onClose}));
            modalElement.remove();
        })

        inputArr = [inputWrapper, selectWrapper, errorsContainer, inputSubmit, deleteButton]
    }

    const form = createdElement({
        tagname: "form",
        class: "addClient flex",
    }, inputArr);

    const modelTitle = createdElement({
        tagname: "h2",
        class: "subtitle add-client__title",
        text: title
    });

    const closeButton = createdElement({
        tagname: "button",
        class: "form-close closeAddForm",
    });

    const modelContent = [modelTitle, form, closeButton];
    
    var modalElement = createdElement({
        tagname: "div",
        class: "pop-up-add-client",
    }, modelContent); 
    modalElement.id = 'formAdd';

    closeButton.addEventListener('click', () => {
        onClose(modalElement);
    })

    let modal = {modalElement, checker, client, contacts};
    let countClick = 0;

    form.addEventListener('submit', e => {
        e.preventDefault();

        preloader.classList.remove('prelodader--disabled');

        modal.contacts = [];
        // console.log('-----------2-2-2-2-2-2-2-2-2-2--------------')
        let checker = true;
        contactsContent.forEach(e => {
            let contact = {
                type: e[0].value,
                value: e[1].value,
            };
            modal.contacts.push(contact);

            if (contact.value == '') checker = false;
            // console.log(contact);
        })

        console.log(checker, modal.contacts.length)
        // let validatorFunc = validator(modal, true);
        let validatorFunc = null;
        if (modal.contacts.length == 0) {
            if (countClick === 0) {
                validatorFunc = null;
                validatorFunc = validator(modal, true)
                console.log(countClick, '--- кликов')
                countClick++;
            } else {
                console.log(countClick, '--- кликов')
                validatorFunc = null;
            }
            
        } else {
            if (checker == true) {
                // validatorFunc = null;
                // validatorFunc = validator(modal, true)
                // console.log('checker = true')

                if (countClick === 0) {
                    validatorFunc = null;
                    validatorFunc = validator(modal, true)
                    console.log(countClick, '--- кликов')
                    countClick++;
                } else {
                    console.log(countClick, '--- кликов')
                    validatorFunc = null;
                }

                let contantactErrors = document.querySelectorAll('.contact-error');
                    contantactErrors.forEach(e => {
                        e.classList.remove('contact-error--active');
                    })
            } else {
                modal.contacts = [];
    
                let contantactErrors = document.querySelectorAll('.contact-error');
                    contantactErrors.forEach(e => {
                        e.classList.add('contact-error--active');
                    })
            }
        }           
    });

    return modal;
}

function errorsAlert (response, client, event, listClients) {

   if (event === 'add') {
        if (response.status == 201) {    
            if (client) {
                preloader.classList.add('prelodader--disabled');
                addAllClients(client);
            }
        } 
        else if (response.status == 422) {
            alert(`Произошла ошибка при попытке создания клиента. Поля фамилии, имени и контактов должны быть заполнены`);
        }
        else if (response.status == 500) {
            alert('Cтранно, но сервер сломался : Обратитесь к куратору Skillbox, чтобы решить проблему')
        } else {
            alert('Что-то пошло не так...')
        }
   }

   if (event === 'edit') {
    if (response.status == 200) {  
        preloader.classList.add('prelodader--disabled');
        removeAllClients(allTr);  
        addAllClients(listClients);
    } 
    else if (response.status == 422) {
        alert(`Произошла ошибка при попытке редактирования клиента. Поля фамилии, имени и контактов должны быть заполнены`);
    }
    else if (response.status == 500) {
        alert('Cтранно, но сервер сломался : Обратитесь к куратору Skillbox, чтобы решить проблему')
    } else {
        alert('Что-то пошло не так...')
    }
   }
}

async function onSave(formData, modalElement, event, dopData) {
    if (event === 'add') {
        // console.log('add');

        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.name,
                surname: formData.surname,
                lastName: formData.lastName,
                contacts: formData.contacts,
            }),
            headers: {'Content-type': 'application/json'}
        });
        const client = await response.json();
        console.log(response, client);
        
        errorsAlert(response, client, 'add');
    };
    
    if (event === 'edit') {
        // console.log('edit', formData);

        const response = await fetch(`http://localhost:3000/api/clients/${formData.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                name: dopData.name,
                surname: dopData.surname,
                lastName: dopData.lastName,
                contacts: dopData.contacts,
            }),
            headers: {'Content-type': 'application/json'}
        });
        console.log(response);

        // removeAllClients(allTr);

        const responseAllClients = await fetch('http://localhost:3000/api/clients');
        const listClients = await responseAllClients.json();

        errorsAlert(response, '', 'edit', listClients);

        // addAllClients(listClients);
    }
    overlay.classList.remove('overlay--active');
    modalElement.remove();
}

function onClose(modalElement) {
    modalElement.remove();
    overlay.classList.remove('overlay--active');
}

function addAllClients(clients, dontPush) {
    const table = document.getElementById('tbody');

    if (Array.isArray(clients)) {
        for (let i = 0; i < clients.length; i++) {
            const id = createIdTd(clients[i]);
            const fio = createFioTd(clients[i]);
            const dateCreateValue = getDateValue(clients[i], 'created'); 
            const dateCreate = createDateTd(dateCreateValue);
            const dateUpdateValue = getDateValue(clients[i], ''); 
            const dateUpdate = createDateTd(dateUpdateValue);
            const contacts = createContactTd(clients[i].contacts);
            // const updateBtn = createUpdateBtn(clients[i]);
            // const deleteBtn = createDeleteBtn(clients[i]);

            const buttons = createButtonsWrapper(createUpdateBtn(clients[i]), createDeleteBtn(clients[i]));

            // const finalTr = createTr(id, fio, dateCreate, dateUpdate, contacts, updateBtn, deleteBtn);
            const finalTr = createTr(id, fio, dateCreate, dateUpdate, contacts, buttons);
            table.append(finalTr);

            if (dontPush) {
                allTr.push(finalTr);
            } else {
                allTr.push(finalTr);
                allClients.push(clients[i])
            }
        }
    } else{
        const id = createIdTd(clients);
        const fio = createFioTd(clients);
        const dateCreateValue = getDateValue(clients, 'created'); 
        const dateCreate = createDateTd(dateCreateValue);
        const dateUpdateValue = getDateValue(clients, ''); 
        const dateUpdate = createDateTd(dateUpdateValue);
        const contacts = createContactTd(clients.contacts);
        // const updateBtn = createUpdateBtn(clients);
        // const deleteBtn = createDeleteBtn(clients);
        const buttons = createButtonsWrapper(createUpdateBtn(clients), createDeleteBtn(clients));

        const finalTr = createTr(id, fio, dateCreate, dateUpdate, contacts, buttons);
        table.append(finalTr);
        if (dontPush) {
            allTr.push(finalTr);
        } else {
            allTr.push(finalTr);
            allClients.push(clients)
        }
        // console.log(allTr);
    }

}

function removeAllClients(listClients, dontRemove) {
    for (let i = 0; i < listClients.length; i++) {
        listClients[i].remove();
    }

    if (dontRemove) {
        allTr = [];
    } else {
        allTr = [];
        allClients = [];
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {

    // const testMask = document.getElementById('testMask');
    // let test = new Inputmask('8 (999) 999-999-99');
    // test.mask(testMask)

    const response = await fetch('http://localhost:3000/api/clients');
    const listClients = await response.json();
    addAllClients(listClients);

    var preloader = document.getElementById('preloader');
    preloader.classList.add('prelodader--disabled');

    var overlay = document.getElementById('overlay');

    const addClient = document.getElementById('newClientBtn');
    addClient.addEventListener('click', () => {
        const modal = createModalWithForm({}, {onSave, onClose}, 'Новый клиент');
        document.body.append(modal.modalElement)
        overlay.classList.add('overlay--active');
    });

    const idSort = document.getElementById('id-sort');
    const idListUp = document.getElementById('list-id-up');
    const idListDown = document.getElementById('list-id-down');
    const idTitle = document.getElementById('id-title');

    let chekerSortIdUp = false;
    idSort.addEventListener('click', () => {
        let clientsSort = allClients.map(e => e);

        idListUp.classList.toggle('list-id-up-disabled');
        idListDown.classList.toggle('list-id-down-active');
        idTitle.classList.toggle('thead__td--title-down')

        if (chekerSortIdUp) {
            clientsSort.sort((first, second) => {
                if (first.id < second.id) return -1;
                if (first.id > second.id) return 1;
                else{return 0}
            })
        } else {
            clientsSort.sort((first, second) => {
                if (first.id > second.id) return -1;
                if (first.id < second.id) return 1;
                else{return 0}
            })
        }
        chekerSortIdUp = !chekerSortIdUp;
        console.log(clientsSort);
        removeAllClients(allTr);
        addAllClients(clientsSort);
    });

    const fioSort = document.getElementById('fio-sort');

    const fioListUp = document.getElementById('list-fio-up');
    const fioListDown = document.getElementById('list-fio-down');
    const fioTitle = document.getElementById('fio-title');

    let chekerSortFioUp = false;
    fioSort.addEventListener('click', () => {
        let clientsSort = allClients.map(e => e);

        fioListUp.classList.toggle('list-id-up-disabled');
        fioListDown.classList.toggle('list-id-down-active');
        fioTitle.classList.toggle('thead__td--title-down')

        if (chekerSortFioUp) {
            clientsSort.sort((first, second) => {
                if ((first.surname < second.surname) || (first.surname === second.surname && first.name < second.name) || (first.surname === second.surname && first.name === second.name && first.lastname < second.lastname)) {return -1}
                if ((first.surname > second.surname) || (first.surname === second.surname && first.name > second.name) || (first.surname === second.surname && first.name === second.name && first.lastname > second.lastname)) {return 1}
    
                return 0
            })
        } else {
            clientsSort.sort((first, second) => {
                if ((first.surname < second.surname) || (first.surname === second.surname && first.name < second.name) || (first.surname === second.surname && first.name === second.name && first.lastname < second.lastname)) {return 1}
                if ((first.surname > second.surname) || (first.surname === second.surname && first.name > second.name) || (first.surname === second.surname && first.name === second.name && first.lastname > second.lastname)) {return -1}
    
                return 0
            })
        }
        chekerSortFioUp = !chekerSortFioUp;
        console.log(clientsSort);
        removeAllClients(allTr);
        addAllClients(clientsSort);
    });

    const dateCreateSort = document.getElementById('dateCreate-sort');

    const dateCreateListUp = document.getElementById('list-datecreate-up');
    const dateCreateListDown = document.getElementById('list-datecreate-down');
    const dateCreateTitle = document.getElementById('datecreate-title');

    let chekerSortDateCreateUp = false;
    dateCreateSort.addEventListener('click', () => {
        let clientsSort = allClients.map(e => e);

        dateCreateListUp.classList.toggle('list-id-up-disabled');
        dateCreateListDown.classList.toggle('list-id-down-active');
        dateCreateTitle.classList.toggle('thead__td--title-down')

        if (chekerSortDateCreateUp) {
            clientsSort.sort((first, second) => {
                if (first.createdAt < second.createdAt) return -1;
                if (first.createdAt > second.createdAt) return 1;
                else{return 0}
            })
        } else {
            clientsSort.sort((first, second) => {
                if (first.createdAt < second.createdAt) return 1;
                if (first.createdAt > second.createdAt) return -1;
                else{return 0}
            })
        }

        chekerSortDateCreateUp = !chekerSortDateCreateUp;
        console.log(clientsSort);
        removeAllClients(allTr);
        addAllClients(clientsSort);
    });

    const lastUpdateSort = document.getElementById('lastUpdate-sort');

    const dateUpdateListUp = document.getElementById('list-dateupdate-up');
    const dateUpdateListDown = document.getElementById('list-dateupdate-down');
    const dateUpdateTitle = document.getElementById('dateupdate-title');

    let chekerSortDateUpdateUp = false;
    lastUpdateSort.addEventListener('click', () => {
        let clientsSort = allClients.map(e => e);
        
        dateUpdateListUp.classList.toggle('list-id-up-disabled');
        dateUpdateListDown.classList.toggle('list-id-down-active');
        dateUpdateTitle.classList.toggle('thead__td--title-down')

        if (chekerSortDateUpdateUp) {
            clientsSort.sort((first, second) => {
                if (first.updatedAt < second.updatedAt) return -1;
                if (first.updatedAt > second.updatedAt) return 1;
                else{return 0}
            })
        } else {
            clientsSort.sort((first, second) => {
                if (first.updatedAt < second.updatedAt) return 1;
                if (first.updatedAt > second.updatedAt) return -1;
                else{return 0}
            })
        }
        
        chekerSortDateUpdateUp = !chekerSortDateUpdateUp;
        console.log(clientsSort);
        removeAllClients(allTr);
        addAllClients(clientsSort);
    });

    const searchClients = document.getElementById('search-clients');

    let timeOut;
    searchClients.addEventListener('input', () => {

        preloader.classList.remove('prelodader--disabled');
        
        let value = searchClients.value;
        console.log(value, '----------', typeof value)
        clearTimeout(timeOut);

        let filterRes = allClients.map(elem => elem);
        console.log(allClients);
        filterRes = filterRes.filter(client => {
                let fio = `${client.surname} ${client.name} ${client.lastName}`
                return fio.toUpperCase().includes(searchClients.value.toUpperCase());  
        })
        console.log(filterRes);

        timeOut = setTimeout( async () => {
            removeAllClients(allTr, true);
            addAllClients(filterRes, true);
            preloader.classList.add('prelodader--disabled');
        }, 300)

        
    })

})

})();
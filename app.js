var budgetController = (function() {
    //assign all data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1, 
        percentages: {
            percentagesValue: [],
            percentagesId: []
        }
    }


    return {
        addItem: function(type, des, val) {
            var newItem, ID

            //create new id
            if(data.allItems[type].length == 0){
                ID = 0
            }
            else{
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }

            newItem = {
                id: ID,
                description: des,
                value: val
            }

            //push new item to the data
            data.allItems[type].push(newItem)

            //return new item
            return newItem

        },

        calcBudget: function() {  
            var calcTotals = function(type) {
                data.totals[type] = 0
        
                data.allItems[type].forEach(function(el, index) {
                    data.totals[type] += data.allItems[type][index].value
                })
        
            }
    
            //calculate totals
            calcTotals('exp')
            calcTotals('inc')

            //calculate budget
            data.budget = data.totals['inc'] - data.totals['exp']

            //calculate general percent

            if(data.totals['exp'] != 0 && data.totals['inc'] != 0) {
                data.percentage = Math.round(data.totals['exp'] / data.totals['inc'] * 100) + '%'
            }
            else{
                data.percentage = '---' 
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalExp: data.totals['exp'],
                totalInc: data.totals['inc']
            }
        },

        calcPercentages: function() {
            data.percentages.percentagesValue = []
            data.percentages.percentagesId = []

            if(data.allItems['inc'].length != 0){
                data.allItems['exp'].forEach(function(el) {
                    data.percentages.percentagesValue.push(Math.round(el.value / data.totals.inc * 100))
                    data.percentages.percentagesId.push(el.id)
                })
            }
            else{
                data.allItems['exp'].forEach(function(el) {
                    data.percentages.percentagesValue.push('---')
                    data.percentages.percentagesId.push(el.id)
                }) 
            }
        },

        getPercentages: function() {
            return {
                percentagesValue: data.percentages.percentagesValue,
                percentagesId: data.percentages.percentagesId
            }
        },

        removeDataItem: function(str) {
            var delType, delId

            delType = str.split('-')[0]
            delId = parseInt(str.split('-')[1])

            data.allItems[delType].forEach(function(el, index) {
                if(el.id == delId){
                    data.allItems[delType].splice(index, 1)
                }
            })
        }
    }

}) () 



var UIController = (function() {
    //assign DOM classes
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        date: '.budget__title',
        budgetValue: '.budget__value',
        budgetExp: '.budget__expenses--value',
        budgetInc: '.budget__income--value',
        budgetPercentage: '.budget__expenses--percentage',
        deleteBtn: '.item__delete--btn',
        container: '.container',
        containerExpenses: '.expenses',
        expensePercentage: '.item__percentage',
        redClass: 'red',
        redFocusClass: 'red-focus'
    }

    var formatNumbers = function(num, type) {
        var int, dec, sign
        num = Math.abs(num)
        num = num.toFixed(2)

        int = num.split('.')[0]
        dec = num.split('.')[1]

        if(int.length >= 4){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }
        else{}

        type == 'exp' ?  sign = '-' : sign = '+'

        return sign + ' ' + int + '.' + dec
    }

    return {
        //update date
        addDate: function() {
            const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
            var d = 'Available budget in ' + monthNames[new Date().getMonth()] + ' ' + new Date().getFullYear() + ':'
        
            document.querySelector(DOMstrings.date).insertAdjacentHTML('beforeend', d)
        },

        //return type, description and value of the input
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        //return DOMstrings
        getDOMstrings: function() {
            return DOMstrings
        },

        //add item to the list
        addListItem: function(obj, type) {
            var html

            if(type === 'inc'){
                html = 
                `<div class="item clearfix" id="${type}-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumbers(obj.value, type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            }
            else if(type === 'exp'){
                html = 
                `<div class="item clearfix" id="${type}-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumbers(obj.value, type)}</div>
                        <div class="item__percentage">---</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            }

            //add new item to the list
            document.querySelector('.' + type + '__list').insertAdjacentHTML('beforeend', html)
        },
        
        clearFields: function() {
            document.querySelector(DOMstrings.inputDescription).value = ''
            document.querySelector(DOMstrings.inputValue).value = ''
        },

        displayBudget: function(obj) {
            var type 
            obj.budget >= 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOMstrings.budgetValue).innerHTML = `${formatNumbers(obj.budget, type)}`
            document.querySelector(DOMstrings.budgetExp).innerHTML = `${formatNumbers(obj.totalExp, 'exp')}`
            document.querySelector(DOMstrings.budgetInc).innerHTML = `${formatNumbers(obj.totalInc, 'inc')}`
            document.querySelector(DOMstrings.budgetPercentage).innerHTML = `${obj.percentage}`
        },

        displayPercentages: function(obj) {
            if(obj.percentagesValue[0] != '---'){
                obj.percentagesId.forEach(function(el, index) {
                    document.querySelector(`#exp-${el}`).childNodes[3].childNodes[3].innerHTML = `${obj.percentagesValue[index]}%`
                })  
            }  
            else{
                obj.percentagesId.forEach(function(el) {
                    document.querySelector(`#exp-${el}`).childNodes[3].childNodes[3].innerHTML = `---`
                }) 
            }
        },

        removeListItem: function(el) {
            el.remove()
        },

        changeStyle: function() {
            var type

            type = document.querySelector(DOMstrings.inputType).value

            if(type == 'exp') {
                document.querySelector(DOMstrings.inputType).classList.add(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputDescription).classList.add(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputValue).classList.add(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputBtn).classList.add(DOMstrings.redClass)
            }
            else if(type == 'inc'){
                document.querySelector(DOMstrings.inputType).classList.remove(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputDescription).classList.remove(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputValue).classList.remove(DOMstrings.redFocusClass)
                document.querySelector(DOMstrings.inputBtn).classList.remove(DOMstrings.redClass)
            }
        }, 
    }
}) ()



var controller = (function(budgetCtrl, UICtrl) {

    //get DOM classes from UIController module
    var DOM = UICtrl.getDOMstrings()

    //event listeners
    var setupEventListeners = function() {

        //event listener for the button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        //event listener for the key 
        document.addEventListener('keypress', function(e) {
    
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem()
            }else{}
    
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeStyle)

    }

    var updateBudget = function() {
        budgetCtrl.calcBudget()
        var budget = budgetCtrl.getBudget()
        UICtrl.displayBudget(budget)
    }

    var updatePercentages = function() {
        budgetCtrl.calcPercentages()
        var percentages = budgetCtrl.getPercentages()

        UICtrl.displayPercentages(percentages)
    }
    
    //function for receiving input data
    var ctrlAddItem = function() {
        var input, newItem

        //object with input data
        input = UICtrl.getInput()

        UICtrl.clearFields()

        if(input.description !== '' && input.value > 0 && !isNaN(input.value)) {

            //object with input data and id and add new item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            //update list UI
            UICtrl.addListItem(newItem, input.type)

            //update budget
            updateBudget()

            //update percentages
            updatePercentages()
        }

    }

    var ctrlDeleteItem = function(event) { 
        var item

        item = event.target.parentNode.parentNode.parentNode.parentNode

        if(item.id) {
            UICtrl.removeListItem(item)

            budgetCtrl.removeDataItem(item.id)

            updateBudget()

            updatePercentages()
        } 
    }
    
    return {
        init: function() {
            console.log('Application has been launched')
            setupEventListeners()
            UICtrl.addDate()
        }
    }
}) (budgetController, UIController)

controller.init()
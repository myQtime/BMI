const height = document.getElementById('height');
const weight = document.getElementById("weight");
const heightCheck = document.querySelector('.heightCheck')//身高驗證用
const weightCheck = document.querySelector('.weightCheck')//體重驗證用
const run = document.querySelector(".run");//計算BMI按鈕
const result = document.querySelector('.result');//計算結果
const BMI = document.querySelector('.BMI');//顯示BMI結果
const reset = document.querySelector('.reset-btn');//重新下一筆計算的按鈕
const list = document.querySelector('.list')
const data = JSON.parse(localStorage.getItem("dataString")) || [] ;//取localStorage的值

//畫面渲染
function init(){
    if (data.length === 0){
        list.innerHTML = '<h2>目前無紀錄</h2>'
    }else if (data.length >= 0){
        let str ="";
        data.forEach(function(item,i){
            str+= `<li class="card ${data[i].color}"><div class="statu">${data[i].statu}</div>
            <div class="div-b"><span>BMI</span>${data[i].BMI}</div>
            <div class="div-w"><span>weight</span>${data[i].weight}kg</div>
            <div class="div-h"><span>height</span>${data[i].height}cm</div>
            <div class="cardFoot"><span>${data[i].date}</span><i class="fas fa-trash-alt delete" data-num=${i} title="刪除此筆資料"></i></div>
        </li>`
        })
        str+= `<a href="#" class="deleteAll"><i class="far fa-times-circle"></i>清除全部紀錄</a>`;
        list.innerHTML = str;
    };
}

//計算BMI按鈕監聽
run.addEventListener('click',function(){
    //先判斷身高體重的值是否正確
    if(height.value === "" || height.value <= 10 || height.value >=300){
        heightCheck.textContent = "→→→請輸入有效數字!";
        return;
    } else {heightCheck.textContent =""
    }
    if(weight.value === "" || weight.value <= 0 || weight.value >=1000){
        weightCheck.textContent = "→→→請輸入有效數字!";
        return;
    } else {weightCheck.textContent =""
    }

    let heightNum = Number(height.value).toFixed(1); // .value為字串，需轉成Number，再取至小數第一位。
    let weightNum = Number(weight.value).toFixed(1); // 可注意Nunber,parseInt,parseFloat三者轉數字的不同
    let bmi = (weightNum/((heightNum/100)**2)).toFixed(2);//身高除以100轉換單位為公尺
    BMI.textContent = bmi;//置換內容為BMI結果

    displayChange();// none<-->block

    let color;
    let obj={};
    obj.height = heightNum;
    obj.weight = weightNum;
    obj.BMI = bmi;
    obj.statu = checkBMI(bmi);

    switch(checkBMI(bmi)){
        case "過輕":
            color = 'underweightCard';
            break;
        case "理想":
            color = 'normalCard';
            break;
        case "過重":
            color = 'overweightCard';
            break;
        case "輕度肥胖" :
            color = 'obeseICard';
            break;
        case "中度肥胖" :
            color = 'obeseIICard';
            break;
        case "重度肥胖" :
            color = 'obeseIIICard';
            break;
    }

    obj.color = color;
    obj.date = getToday();

    data.unshift(obj);//新增至第一筆
    localStorage.setItem("dataString",JSON.stringify(data));//存入localStorage

    init();
})

// display 切換 及 清空input的值
reset.addEventListener('click',function(){
    displayChange();
    height.value = "";
    weight.value = "";
})


//判斷BMI 同時更改result的class
function checkBMI(BMI){
    result.className = 'result'; //清空全部class 並置換成指定class
    if (BMI<18.5){
        result.classList.add('underweight');
    return "過輕";
    }else if (18.5<=BMI && BMI<24){
        result.classList.add('normal');
    return "理想";
    }else if (24<=BMI && BMI<27){
        result.classList.add('overweight');
        return "過重";
    }else if (27<=BMI && BMI<30){
        result.classList.add('obeseI');
        return "輕度肥胖";
    }else if (30<=BMI && BMI<35){
        result.classList.add('obeseII');
        return "中度肥胖";
    }else if (BMI>=35){
        result.classList.add('obeseIII');
        return "重度肥胖";
    }
}

//取得日期資訊
function getToday(){
    let now = new Date();
    let yyyy = now.getFullYear();
    let MM = now.getMonth()+1;
    let dd = now.getDate();
    if(dd < 10){
        dd = "0"+ dd;
    }
    date = `${MM}-${dd}-${yyyy}`
    return date;
}

//run 及 reset 兩個元件的 display 切換
function displayChange(){
    run.classList.toggle('d-none')
    result.classList.toggle('d-none')
}

//刪除單筆資料
list.addEventListener('click',function(e){
    if (e.target.hasAttribute('data-num')){
        let num = e.target.dataset.num;
        data.splice(num,1)
        localStorage.setItem("dataString",JSON.stringify(data));//存入localStorage
        init()
    }
})

//刪除全部資料
list.addEventListener('click',function(e){
    e.preventDefault();
    if (e.target.nodeName === "A"){
        data.length = 0;
        localStorage.setItem("dataString",JSON.stringify(data));//存入localStorage
        init();
    }
})


//enter 輸入
document.addEventListener("keyup",function(e){
    if (e.key ==="Enter"){
        run.click()
    }
})

init();
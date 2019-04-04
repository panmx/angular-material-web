// 自定义富文本编辑器配置
export let LaydateConfig = {
    theme: '#4dc6fd', // 主题色
    dealTime: function() { // laydate【选择时间】隐藏秒，设置指定小时/分钟
        let a = document.getElementsByClassName('laydate-btns-time');
        if(a && a.length){
            // 监听【选择时间】点击事件
            a[0].addEventListener("click", function () {
                let b = document.getElementsByClassName('laydate-time-list');
                if(b[0]){
                    let childs = b[0].childNodes;
                    for(let i = 0; i < childs.length; i++) {
                        // 移除秒
                        if(i == 2){
                            b[0].removeChild(childs[i]);
                        }else {
                            let showtimeParent= childs[i].childNodes[1];
                            let showtime= showtimeParent.childNodes;
                            // let showtime = childs[i]['getElementsByTagName']('li');
                            let showtimeLength = showtime  ? showtime.length : 0;
                            for(let y=0; showtime && y<showtime.length; y++){
                                let t00 = showtime[y] &&  showtime[y]['innerText'] ? showtime[y]['innerText'].trim() : '';
                                // if(i==0){ // 设置指定小时
                                //     if (t00 == '00' || t00 == '01' || t00 == '02' || t00 == '03'
                                //             || t00 == '04' || t00 == '05' || t00 == '06' || t00 == '07'
                                //             || t00 == '08' || t00 == '19' || t00 == '20' || t00 == '21'
                                //             || t00 == '22' || t00 == '23') {
                                //         showtimeParent.removeChild(showtime[y]);
                                //         y = y-1;
                                //     }
                                // }
                                if(i==1){ // 设置指定分钟
                                    if (!(t00 == '00' || t00 == '10' || t00 == '20' || t00 == '30'
                                            || t00 == '40' || t00 == '50' || t00 == '60')) {
                                        showtimeParent.removeChild(showtime[y]);
                                        y = y-1;
                                    }
                                }
                            }
                        }
                    }
                    // 设置样式
                    let liList = childs;
                    for(let i=0; liList && i< liList.length; i++){
                        liList[i]['style'].width = '50%';
                    }
                }
            })
        }
    }

};

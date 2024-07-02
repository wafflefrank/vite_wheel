<template>
    <!-- <SwiperCarousel /> -->
    <div class="mt-5 mb-3"><img class="banner_style" src="../assets/backGround/event_0606.jpg" alt="#" /></div>
    <div>
      <div class="d-flex justify-content-center">
        <button class="line_btn me-3" @click="goLine()"><img src="../assets/banner/line_logo.png" alt="" /><span class="ms-2 text-white">Line活動專員</span></button>
        <button class="game_btn" @click="goLine()">
          <span class="ms-2 text-white">娛樂城</span>
        </button>
      </div>
    </div>

    <!-- 帳戶 -->
    <div class="d-flex align-items-center justify-content-center mb-5 mt-5 phone_style">
      <!-- <span class="text-white me-5 fs-4">帳戶: {{ this.memberAccount }}</span> -->
      <span style="color: rgb(77, 74, 74)" class="me-5 text-start"
        ><span class="fs-4"
          >剩餘抽獎次數: <span class="drawNums_style">{{ this.drawNum }}</span></span
        >
        <br />(若卡在抽獎過程,刷新不減抽獎次數！</span
      >
      <div class="phone_inputKey d-flex">
        <button class="button-72 me-2" @click="inputCode()">輸入序號</button>
        <button class="button-73" @click="getDrawHistory()">抽獎紀錄</button>
      </div>
    </div>

    <div class="mb-5 d-flex flex-column align-items-center" v-if="isRouterAlive">
      <!-- 轉盤 -->
      <div class="lucky-wheel">
        <div class="pointer-container">
          <!-- pointer -->
          <div
            class="pointer"
            ref="pointer"
            id="pointer"
            :style="{ transform: rotate_deg, transition: prize_transition }"
            @click="rotateHandler(num)"
            @keydown="rotateHandler(num)"
          ></div>
        </div>
        <!-- lucky wheel -->
        <div :class="containerClass">
          <div v-for="item in prizes_new" :key="item.name" ref="item" :class="itemClass">
            <div class="prize_Img"></div>
            <div :class="contentClass">
              <!-- <i class="material-icons">
                {{ item.icon }}
              </i> -->
              <span
                >{{ item.name }}
                <span :class="countClass">{{ item.count }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中獎動畫 -->
      <transition name="slide-fade">
        <div class="prize" v-if="isShow === true && fullWidth > 600">
          <div class="prize-container">
            <div class="prize-title"></div>
            <div class="prize-title">
              恭喜獲得...
              <span class="prize-item">{{ this.prizes[this.prizeIndex - 1].fonts[0].text }}</span>
            </div>
            <div class="prize-background">
              <div>
                <i v-for="item in 9" class="fa-solid fa-snowflake" :key="item"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 中獎說明 -->
      <div class="directionBox">
        <div class="D_title"><img src="../assets/banner/win_des.png" alt="" /></div>
        <div class="D_Word">
          <!-- <p>1.為避免【會員瀏覽器問題】所有得獎者獎項一律以LEO娛樂城抽獎系統歷史記錄為主。</p>
          <p>2.中獎禮金將於21號後依序轉入會員的遊戲帳戶。</p>
          <p>3.本活動最終解釋權歸LEO娛樂城所有。</p> -->
          <pre style="color: rgb(77, 74, 74)">{{ this.awardText }}</pre>
        </div>
      </div>
      <!-- 活動說明 -->
      <div class="directionBox">
        <div class="D_title"><img src="../assets/banner/act_des.png" alt="" /></div>
        <div class="D_Word">
          <pre style="color: rgb(77, 74, 74)">{{ this.activityText }}</pre>
          <!-- <p>1.LEO娛樂城EX與KU經銷專屬幸運大抽獎，僅有EX與KU旗下會員才可參加抽獎活動，非EX與KU旗下會員將不符合資格。</p>
          <p>2.會員當月存款金額累計滿10000點(含)以上且需一倍流水，獲得抽獎次數1次，最多儲值滿30000點(含)以上且需一倍流水，獲得抽獎次數3次。</p>
          <p>3.次月1號至10號經審查合格後，將於隔日11號可獲得抽獎序號，會員需自行至抽獎活動網址進行抽獎。</p>
          <p>4.審核合格後，當月20號以前未自行前往抽獎則視為放棄資格。</p>
          <p>5.任何參與資格都以LEO娛樂城抽獎系統判斷為主，不得有爭議。<br />&nbsp;</p> -->
        </div>
      </div>
    </div>
    <!-- 輸入抽獎碼彈窗 -->
    <el-dialog class="drawModel_style" v-model="dialogFormVisible" title="抽獎序號驗證" width="70%" center>
      <el-form :model="getDrawNums">
        <el-form-item label="抽獎序號:" class="codeForm_style">
          <el-input class="codeInput_style" v-model="getDrawNums.code" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="cancelBtn" color="#a3a3a3" @click="dialogFormVisible = false">取消</el-button>
          <el-button class="verifyBtn" color="#c71e2d" @click="doVarify()">認證</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 抽獎紀錄彈窗 -->
    <el-dialog class="loginHistory_style" v-model="drawHistory_Visible" title="中獎歷史紀錄" width="40%" center>
      <div class="loginHyTable_style">
        <el-table
          :data="drawHistory_Data"
          :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(115, 111, 159, 0.46) 100%)', color: '#000' }"
        >
          <el-table-column prop="code" label="驗證碼" width="100" align="center">
            <!-- <template v-slot="{ row }">{{ formatCode(row) }}</template> -->
          </el-table-column>
          <el-table-column prop="isEnter" label="使用紀錄" align="center">
            <template v-slot="{ row }">
              <el-tag :type="row.isEnter === true ? 'success' : 'danger'">
                {{ formatisEnter(row.isEnter) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="award" label="獎品名稱" align="center">
            <template v-slot="{ row }">{{ formatAward(row.award) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </template>

<script>
import _ from 'lodash';
import borderImg from '../assets/backGround/zp2_bg.png';
import startBtn from '../assets/backGround/startBtn.png';
import selectBtn from '../assets/backGround/zp3_btn2.png';
import coinImg from '../assets/backGround/goldCoin.png';
import coinBag from '../assets/backGround/goldcoins_bag.png';
import greenBag from '../assets/backGround/greenBag.png';
import ticketImg from '../assets/backGround/ticket3.png';
import treasureImg from '../assets/backGround/treasure.png';

export default {
  components: {
    // SwiperCarousel,
  },
  // watch: {
  //   pcVersion(newValue, oldValue) {
  //     console.log(newValue, oldValue);
  //     if (newValue === true && oldValue === false) {
  //       console.log('重整頁面');
  //       this.reloadPage();
  //     } else if (newValue === false && oldValue === true) {
  //       console.log('重整頁面');
  //       this.reloadPage();
  //     }
  //   },
  // },
  data() {
    return {
      isRouterAlive: true,
      // 驗證碼
      getDrawNums: {
        code: '',
      },
      // 驗證表單
      dialogFormVisible: false,
      // 抽獎驗證碼表單
      getCode_Form: {
        code: '',
      },
      // 使用者帳戶(測試用)
      memberAccount: 'frank',
      // 剩餘抽獎次數(測試用)
      drawNum: 0,
      // 暫存抽獎次數
      storedDrawNums: 0,
      // 最新消息列表(測試用)
      translate_News: [
        { memberID: '12345', money: 1000 },
        { memberID: '13579', money: 2000 },
        { memberID: '24688', money: 3000 },
      ],
      // 返回獎項索引值
      prizeIndex: 0,
      // 獎項名稱
      prizeName: '禮金8888',
      lotteryMsg: '',
      // 電腦版
      blocks: [{ padding: '55px', background: '#869cfa', imgs: [{ src: borderImg, width: '100%', rotate: true }] }],
      prizes: [
        // 0
        {
          background: '#ee95a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 1
        {
          background: '#c98ef4',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 2
        {
          background: '#ee95a9',
          imgs: [{ src: coinBag, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 3
        {
          background: '#c98ef4',
          imgs: [{ src: coinBag, width: '30%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 4
        {
          background: '#ee95a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 5
        {
          background: '#d945a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 6
        {
          background: '#ffaec1',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 7
        {
          background: '#d945a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '24px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
      ],
      // 手機板
      blocks_phone: [{ padding: '30px', background: '#869cfa', imgs: [{ src: borderImg, width: '100%', rotate: true }] }],
      prizes_phone: [
        // 0
        {
          background: '#ee95a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 1
        {
          background: '#c98ef4',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 2
        {
          background: '#ee95a9',
          imgs: [{ src: coinBag, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 3
        {
          background: '#c98ef4',
          imgs: [{ src: coinBag, width: '40%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 4
        {
          background: '#ee95a9',
          imgs: [{ src: coinBag, width: '40%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 5
        {
          background: '#d945a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
        // 6

        {
          background: '#ffaec1',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },

        // 7

        {
          background: '#d945a9',
          imgs: [{ src: coinImg, width: '20%', top: '60%' }],
          fonts: [
            {
              text: '禮金1000',
              fontSize: '12px',
              top: '30%',
              fontWeight: '600',
            },
          ],
        },
      ],
      // 電腦版
      buttons: [
        {
          radius: '30%',
          // background: '#617df2',
          pointer: true,
          imgs: [
            {
              src: startBtn,
              width: '100%',
              top: '-100%',
              background: '#00ffee',
            },
            {
              src: selectBtn,
              width: '40%',
              top: '-350px',
            },
          ],
        },
        // {
        //   radius: '30%',
        //   background: '#869cfa',
        //   pointer: true,
        //   fonts: [{ text: '開始', top: '-10px' }],
        // },
      ],
      // 手機板
      buttons_phone: [
        {
          radius: '30%',
          // background: '#617df2',
          pointer: true,
          imgs: [
            {
              src: startBtn,
              width: '100%',
              top: '-100%',
              background: '#00ffee',
            },
            {
              src: selectBtn,
              width: '40%',
              top: '-180px',
            },
          ],
        },
        // {
        //   radius: '30%',
        //   background: '#869cfa',
        //   pointer: true,
        //   fonts: [{ text: '開始', top: '-10px' }],
        // },
      ],

      // 中獎畫面
      isShow: false,
      prize_icon: '',
      // 中獎紀錄彈窗
      drawHistory_Visible: false,
      // 中獎紀錄table
      drawHistory_Data: [],
      // 登入
      loginForm: {
        accountId: 'admin',
        password: 'admin',
      },
      // 中獎說明
      awardText: '',
      // 活動說明
      activityText: '',
      // 電腦寬度
      fullWidth: 0,
      fullHeight: 0,
      // 電腦版
      pcVersion: false,

      // 新版轉盤資訊
      prizes_new: [
        {
          name: '獎金200',
          icon: 'cake',
          count: 5,
        },
        {
          name: '電子彩金2500',
          icon: 'stars',
          count: 5,
        },
        {
          name: '獎金5000',
          icon: 'child_care',
          count: 4,
        },
        {
          name: '獎金反俐2000',
          icon: ' flight',
          count: 1,
        },
        {
          name: 'Wifi',
          icon: 'wifi',
          count: 5,
        },
        {
          name: 'Movie',
          icon: 'movie_filter',
          count: 0,
        },
        {
          name: 'Movie',
          icon: 'movie_filter',
          count: 0,
        },
        {
          name: 'Movie',
          icon: 'movie_filter',
          count: 0,
        },
      ],
      current_year: 2017,
      prizes_2017: [],
      prizes_2018: [],
      prize_name: '',
      prize_rotate: [],
      prize_transition: '',
      each_deg: 0,
      rotate_deg: 0,
      start_deg: 0,
      current_deg: 0,
      index: 0,
      duration: 3000,
      time_remaining: 20,
      num: 0,
      numbers: [], // 紀錄還有獎品的編號
      isToggle: false, // 顯示隱藏按鈕
      isClicked: false, // 轉動中禁止觸發
    };
  },
  methods: {
    // 畫面重新整理
    reloadPage() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    // 自訂獎項圖片
    customPrize() {
      this.$http.get('/api/admin/prizes').then((res) => {
        console.log('轉盤資訊:', res.data.data);
        // for (this.i = 0; this.i < res.data.data.length; this.i += 1) {
        //   this.prizes.push(this.prizes_content);
        // }
        // console.log(this.prizes);
        _.forEach(res.data.data, (item, key) => {
          console.log(item, key);
          this.prizes[key].fonts[0].text = item.prize;
          this.prizes_phone[key].fonts[0].text = item.prize;
          console.log(this.prizes);
        });
      });
      // 電腦版
      this.prizes[0].imgs[0].src = treasureImg;
      this.prizes[0].imgs[0].width = '30%';
      this.prizes[0].imgs[0].top = '55%';
      this.prizes[1].imgs[0].src = treasureImg;
      this.prizes[1].imgs[0].width = '30%';
      this.prizes[1].imgs[0].top = '55%';
      this.prizes[2].imgs[0].src = treasureImg;
      this.prizes[2].imgs[0].width = '30%';
      this.prizes[2].imgs[0].top = '55%';
      this.prizes[3].imgs[0].src = coinBag;
      this.prizes[3].imgs[0].width = '30%';
      this.prizes[3].imgs[0].top = '55%';
      this.prizes[4].imgs[0].src = greenBag;
      this.prizes[4].imgs[0].width = '35%';
      this.prizes[4].imgs[0].top = '55%';
      this.prizes[5].imgs[0].src = ticketImg;
      this.prizes[5].imgs[0].width = '30%';
      this.prizes[5].imgs[0].top = '55%';
      this.prizes[6].imgs[0].src = ticketImg;
      this.prizes[6].imgs[0].width = '30%';
      this.prizes[6].imgs[0].top = '55%';
      this.prizes[7].imgs[0].src = ticketImg;
      this.prizes[7].imgs[0].width = '30%';
      this.prizes[7].imgs[0].top = '55%';

      // 手機版
      this.prizes_phone[0].imgs[0].src = treasureImg;
      this.prizes_phone[0].imgs[0].width = '30%';
      this.prizes_phone[0].imgs[0].top = '55%';
      this.prizes_phone[1].imgs[0].src = treasureImg;
      this.prizes_phone[1].imgs[0].width = '30%';
      this.prizes_phone[1].imgs[0].top = '55%';
      this.prizes_phone[2].imgs[0].src = treasureImg;
      this.prizes_phone[2].imgs[0].width = '30%';
      this.prizes_phone[2].imgs[0].top = '55%';
      this.prizes_phone[3].imgs[0].src = coinBag;
      this.prizes_phone[3].imgs[0].width = '30%';
      this.prizes_phone[3].imgs[0].top = '55%';
      this.prizes_phone[4].imgs[0].src = greenBag;
      this.prizes_phone[4].imgs[0].width = '35%';
      this.prizes_phone[4].imgs[0].top = '55%';
      this.prizes_phone[5].imgs[0].src = ticketImg;
      this.prizes_phone[5].imgs[0].width = '30%';
      this.prizes_phone[5].imgs[0].top = '55%';
      this.prizes_phone[6].imgs[0].src = ticketImg;
      this.prizes_phone[6].imgs[0].width = '30%';
      this.prizes_phone[6].imgs[0].top = '55%';
      this.prizes_phone[7].imgs[0].src = ticketImg;
      this.prizes_phone[7].imgs[0].width = '30%';
      this.prizes_phone[7].imgs[0].top = '55%';
    },
    // 獲取說明
    getWebInfo() {
      this.$http.get('/api/admin/website').then((res) => {
        console.log(res.data.data);
        this.awardText = res.data.data[0].winning_instructions;
        this.activityText = res.data.data[0].activity_instructions;
      });
    },
    postLottery() {
      this.$http.post('/api/users/drawing', this.getDrawNums).then((res) => {
        if (res.data.code === 200) {
          // this.$swal.fire('抽獎成功', `恭喜獲取 :${res.data.data.award}`, 'success');
          this.drawNum = res.data.data.count;
          this.prizeIndex = res.data.data.award;
          // localStorage.setItem('storedDrawNums', JSON.stringify(this.drawNum));
          this.setWithExpiry('storedDrawNums', this.drawNum, 600000); // 設定暫存10分鐘;1秒=1000ms
          this.dialogFormVisible = false;
        } else {
          this.$swal.fire('抽獎失敗', `${res.data.msg}`, 'error');
        }
      });
    },
    // 確認驗證碼
    doVarify() {
      // api
      this.$http.post('/api/users/startLottery', this.getDrawNums).then((res) => {
        if (res.data.code === 200) {
          this.drawNum = res.data.count;
          // this.drawNum = 20;
          this.$swal.fire('輸入成功', `${res.data.msg}`, 'success');
          this.dialogFormVisible = false;
          // localStorage.setItem('storedDrawNums', JSON.stringify(this.drawNum));
          this.setWithExpiry('storedDrawNums', this.drawNum, 600000);
          this.setWithExpiry('storedDrawCode', this.getDrawNums.code, 600000);
          this.drawHistory_Data = [];
        } else {
          this.$swal.fire('輸入失敗', `${res.data.msg}`, 'error');
        }
      });

      // test
      // if (this.getCode_Form.code !== '') {
      //   this.$swal.fire('驗證成功', '驗證成功', 'success');
      //   this.dialogFormVisible = false;
      //   this.drawNum = 7;
      // } else {
      //   this.$swal.fire('驗證失敗', '驗證失敗', 'error');
      // }
      this.getCode_Form.code = '';
    },

    // 点击抽奖按钮会触发star回调
    startCallback() {
      if (this.drawNum === 0) {
        this.dialogFormVisible = true;
      }
      if (this.drawNum > 0) {
        this.postLottery();
        // 调用抽奖组件的play方法开始游戏
        this.$refs.myLucky.play();
        this.isShow = false;
        // 模拟调用接口异步抽奖
        setTimeout(() => {
          // 假设后端返回的中奖索引是0
          // const index = 0;

          // 调用stop停止旋转并传递中奖索引
          this.$refs.myLucky.stop(this.prizeIndex - 1);
        }, 3000);
      }
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize);
      if (this.prizeIndex !== '') {
        if (this.fullWidth <= 600) {
          this.showConfirmDialog();
        } else {
          this.showPrize();
        }
        // this.$swal.fire('抽獎成功', `恭喜獲取 :${this.prizes[this.prizeIndex].fonts[0].text}`, 'success');
      }
    },
    // 輸入序號彈窗
    inputCode() {
      this.dialogFormVisible = true;
    },
    // 設定暫存秒數
    setWithExpiry(key, valueNum, ttl) {
      const now = new Date();

      const item = {
        value: valueNum,
        expiry: now.getTime() + ttl, // 注意 ttl 的單位為豪秒
      };

      localStorage.setItem(key, JSON.stringify(item));
    },
    // 讀取暫存
    getWithExpiry() {
      const itemStr = localStorage.getItem('storedDrawNums');
      const itemCode = localStorage.getItem('storedDrawCode');

      if (!itemStr) {
        return null;
      }

      const item = JSON.parse(itemStr);
      const item2 = JSON.parse(itemCode);
      const now = new Date();

      // 比較當前的時間是否已超過我們所設定的過期時間
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('storedDrawNums');
        localStorage.removeItem('storedDrawCode');
        return null;
      }
      console.log('暫存內容:', item.value, item2.value);
      if (item.value === undefined) {
        this.drawNum = 0;
        this.getDrawNums.code = '';
      } else {
        this.drawNum = item.value;
        this.getDrawNums.code = item2.value;
      }
      return this.drawNum;
    },
    showConfirmDialog() {
      this.$swal.fire({
        title: `恭喜獲取 :${this.prizes[this.prizeIndex - 1].fonts[0].text}`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: '確認',
        customClass: {
          title: 'red-title',
          text: 'red-text',
          popup: 'swalBody',
        },
      });
    },
    // 中獎動畫顯示
    showPrize() {
      if (this.isShow === true) {
        this.isShow = false;
      } else if (this.isShow === false) {
        this.isShow = true;
      }
    },
    // 中獎彈窗資料
    getDrawHistory() {
      this.drawHistory_Visible = true;
      console.log(this.codeReview);
      this.$http.get(`/api/users/awards/${this.getDrawNums.code}`).then((res) => {
        this.drawHistory_Data = res.data.data.BetHistories;
        _.forEach(this.drawHistory_Data, (item, key) => {
          // console.log('獎品內容', item);
          this.drawHistory_Data[key].isEnter = res.data.data.isEnter;
          this.drawHistory_Data[key].code = res.data.data.code;
        });
        // console.log('中獎資料', this.drawHistory_Data);
      });
    },
    // 過濾序號使用狀態
    formatisEnter(isEnter) {
      // console.log('是否已使用過', isEnter);
      if (isEnter === true) {
        return '已使用';
      }
      if (isEnter === false) {
        return '未使用';
      }
      return '備用';
    },
    formatAward(award) {
      if (award === '1') {
        // this.drawHistory_Data[0].awardName = this.prizes[0].fonts[0].text;
        return `${this.prizes[0].fonts[0].text}`;
      }
      if (award === '2') {
        // this.drawHistory_Data[0].awardName = this.prizes[1].fonts[0].text;
        return `${this.prizes[1].fonts[0].text}`;
      }
      if (award === '3') {
        // this.drawHistory_Data[0].awardName = this.prizes[2].fonts[0].text;
        return `${this.prizes[2].fonts[0].text}`;
      }
      if (award === '4') {
        // this.drawHistory_Data[0].awardName = this.prizes[3].fonts[0].text;
        return `${this.prizes[3].fonts[0].text}`;
      }
      if (award === '5') {
        // this.drawHistory_Data[0].awardName = this.prizes[4].fonts[0].text;
        return `${this.prizes[4].fonts[0].text}`;
      }
      if (award === '6') {
        // this.drawHistory_Data[0].awardName = this.prizes[5].fonts[0].text;
        return `${this.prizes[5].fonts[0].text}`;
      }
      if (award === '7') {
        // this.drawHistory_Data[0].awardName = this.prizes[6].fonts[0].text;
        return `${this.prizes[6].fonts[0].text}`;
      }
      if (award === '8') {
        // this.drawHistory_Data[0].awardName = this.prizes[7].fonts[0].text;
        return `${this.prizes[7].fonts[0].text}`;
      }
      return '無獎項';
    },
    // 前往Line
    goLine() {
      window.open('https://line.me/R/ti/p/@max7890707?from=page&searchId=max7890707', '_blank');
    },
    // 前往娛樂城
    goEntertaiment() {
      window.open('https://linkby.tw/max7890707', '_blank');
    },

    // 新版轉盤
    reset() {
      this.isShow = true;
      this.index = 0;
      this.prize_name = '';
      this.prize_icon = '';
      this.prize_rotate = [];
      this.numbers = [];
      this.start_deg = 0;
      this.rotate_deg = 'rotate(0deg)';
      this.current_deg = 0;
      this.isClicked = false;
      this.prize_transition = 'none';
      console.log('RESET');
    },
    restart() {
      this.$refs.item[this.index].classList.value = this.itemClass;
      if (this.current_year === 2017) {
        this.time_remaining = 20;
        this.reset();
        this.initPrize();
      }
    },
    initPrize() {
      this.num = 8;
      this.degree(this.num);
      this.prizes = this.prizes_2017;
      this.numberArray();
    },
    degree(num) {
      // 計算每個轉盤角度
      for (let i = 1; i <= num; i += 1) {
        const deg = 360 / num;
        this.each_deg = deg;
        const eachDeg = i * deg;
        this.prize_rotate.push(eachDeg);
        console.log('prize_rotate:', this.prize_rotate);
      }
    },
    numberArray() {
      // 產生獎品 index 編號 => [0,1,2,3,4,5]
      this.numbers = this.prizes_new.map((prize, index) => index);
    },
    rotateHandler(num) {
      // 刪去沒有獎品的 index
      this.prizes_new.filter((prize, index) => {
        if (prize.count <= 0) {
          const filterArray = this.numbers.filter((num1) => num1 !== index);
          console.log(filterArray);
          this.numbers = filterArray;
        }
        return this.numbers;
      });

      if (this.time_remaining > 0) {
        this.$refs.item[this.index].classList.value = this.itemClass;
        // 執行旋轉
        this.prize_draw(num);
      } else if (this.time_remaining <= 0) {
        this.$refs.item[this.index].classList.value = this.itemClass;
        this.restart();
      }
    },
    prize_draw(num) {
      console.log('num:', num);
      // 執行抽獎
      if (this.isClicked) return;
      this.isShow = this.isClicked;

      // 移除抽到獎品 active 狀態
      this.$refs.item[this.index].classList.value = this.itemClass;

      // 取出 0-5之間隨機整數
      this.index = this.numbers[Math.floor(Math.random() * this.numbers.length)];
      console.log('1.剩餘牌號', this.numbers);

      // 預先旋轉四圈
      const circle = 4;
      // degree=初始角度 + 旋轉4圈 + 獎品旋轉角度[隨機數] - 餘數
      const degree = this.start_deg + circle * 360 + this.prize_rotate[this.index] - (this.start_deg % 360);
      console.log(degree);
      console.log('this.prize_rotate:', this.prize_rotate);
      // 將初始角度 start_deg:0度 = 旋轉後的角度 degree，下次執行從當下角度開始
      this.start_deg = degree;
      // 綁定旋轉角度到指針
      if (this.current_year === 2017) {
        this.rotate_deg = `rotate(${degree - 22.5}deg)`;
      }

      this.prize_transition = `all ${this.duration / 1000}s cubic-bezier(0.42, 0, 0.2, 0.91)`;
      this.time_remaining -= 1;
      this.isClicked = true;

      // 取當下開始角度的餘數，與輪盤角度比對(除錯用)
      const remainder = this.start_deg % 360;
      if (remainder <= 0) {
        // 為了不產生負數或0，加360
        if (this.current_year === 2017) {
          this.current_deg = remainder + 360;
        } else {
          this.current_deg = remainder + 360 - this.each_deg / 2;
        }
      } else if (remainder > 0) {
        if (this.current_year === 2017) {
          this.current_deg = remainder;
        } else {
          this.current_deg = remainder - this.each_deg / 2;
        }
      }
      console.log('2.執行旋轉', degree, 'index', this.index);

      // 將this.index設為抽中獎品索引數，獎品抽完的索引數將不再出現，直到獎品全數抽完，重新 RESET
      const prize = this.prizes_new[this.index];
      this.prize_name = prize.name;
      this.prize_icon = prize.icon;
      this.prizeActive();
      setTimeout(() => {
        prize.count -= 1;
        console.log('3.旋轉角度:', this.current_deg, '獎品:', prize.name, '剩餘數量:', prize.count, ' index', this.index);
      }, this.duration);

      // 點選動畫結束後，將"已點選"改回"未點選"
      setTimeout(() => {
        if (this.isClicked === true) {
          this.isClicked = false;
        }
      }, this.duration);
    },
    prizeActive() {
      // 抽到獎品後變更 item 的 css
      setTimeout(() => {
        this.$refs.item[this.index].classList.value = `${this.itemClass} active`;
      }, this.duration);
      console.log('item active');
    },
  },
  created() {
    // this.reloadSavedForm();
    // this.getPrizes();
    // this.getPrizes_phone();
    // this.customPrize();
    this.getWebInfo();
    this.getWithExpiry();
  },
  mounted() {
    this.fullWidth = window.innerWidth;
    this.fullHeight = window.innerHeight;
    window.onresize = () => {
      this.fullWidth = window.innerWidth;
      this.fullHeight = window.innerHeight;
      // console.log(this.fullWidth, this.fullHeight);
      if (this.fullWidth >= 600) {
        this.pcVersion = true;
      } else {
        this.pcVersion = false;
      }
    };

    // 每幾秒刷新指定頁面

    // window.setInterval(() => {
    //   setTimeout(() => {
    //     this.reloadPage();
    //   }, 0);
    // }, 5000);

    // 2秒後更新畫面
    window.setTimeout(() => {
      this.reloadPage();
    }, 2000);
    this.initPrize();
  },
  computed: {
    // 判斷轉盤 class
    containerClass() {
      return this.current_year === 2017 ? 'container' : 'container container-large';
    },
    itemClass() {
      return this.current_year === 2017 ? 'item item-skew' : 'item item-skew-large';
    },
    contentClass() {
      return this.current_year === 2017 ? 'item-content' : 'item-content item-content-large';
    },
    countClass() {
      return this.current_year === 2017 ? 'count' : 'count count-large';
    },
  },
};
</script>

  <style lang="scss" scoped>
  // 扇形顏色
  .section_color {
    background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(244, 82, 96, 0.770920868347339) 24%, rgba(179, 0, 255, 1) 100%);
  }
  .line_btn {
    min-width: 255px;
    background-color: #1e8449;
    font-size: 20px;
    font-weight: 700;
    border-radius: 15px;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    // background: url(../assets/backGround/line_bg.png) no-repeat center;
    // background-size: 100%;
    border: 0;
    &:hover {
      background-color: rgba(39, 174, 96);
    }
    &:focus {
      background-color: rgba(39, 174, 96);
    }
  }
  .game_btn {
    /* CSS */
    min-width: 255px;
    background-color: #ea4c89;
    font-size: 20px;
    font-weight: 700;
    border-radius: 15px;
    cursor: pointer;
    border: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    &:hover {
      background-color: #f082ac;
    }
    &:focus {
      background-color: #f082ac;
    }
  }
  .directionBox {
    max-width: 935px;
    width: 90%;
    margin-top: 50px;
    border: 3px solid #ffa1a1;
    background: transparent;
    // background: rgba(0, 0, 0, 0.5);
    padding: 30px 30px 20px;
    z-index: 1;
    border-radius: 10px;
    box-sizing: border-box;
    position: relative;
    & img {
      position: absolute;
      top: -26px;
      left: 40px;
      height: 45px;
      width: auto;
    }
    & .D_Word {
      text-align: left;
      padding-left: 20px;
      color: rgb(30, 26, 26);
      font-size: 18px;
      font-weight: bold;
    }
  }
  // 輸入驗證碼樣式
  .codeInput_style {
    // width: 80%;
    --el-input-focus-border-color: #f082ac;
    // padding: 10px 200px;
    // & :deep(.el-input__inner) {
    //   padding: 25px 0 25px 0px;
    //   // border-radius: 50px;
    // }
    & :deep(.el-input__wrapper) {
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
      background: #eee;
      // padding-left: 10px;
    }
    & :deep(.el-input-group__prepend) {
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
    }
  }

  // 取消按鈕
  .cancelBtn {
    color: #fff;
    font-weight: bold;
    padding: 20px;
    font-size: 25px;
  }
  // 驗證按鈕
  .verifyBtn {
    color: #fff;
    font-weight: bold;
    padding: 20px;
    font-size: 25px;
  }
  .marquee_style {
    width: 700px;
    margin: auto;
    position: relative;
    & .borderStyle {
      max-width: 700px;
      width: 100%;
      height: 55px;
      // margin: 20px 0 23px 65px;
      background: transparent;
      border: 3px solid #ffa1a1;
      border-radius: 25px;
      padding-left: 100px;
    }
  }
  // 廣播樣式
  .boadcast_style {
    width: 207px;
    width: 200px;
    position: absolute;
    left: -70px;
    top: -80px;
    bottom: 0;
  }
  // 抽獎次數文字樣式
  .drawNums_style {
    // color: rgb(255, 243, 14);
    color: #d31818;
    font-weight: bold;
    font-size: 30px;
  }
  // 獲取獎項動畫
  .slide-fade-enter-active {
    transition: all 0.5s ease-out;
    // transition-delay:  2s;
  }

  .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  // 獲取獎項樣式
  .prize {
    display: flex;
    position: absolute;
    width: 100%;
    height: 300px;
    background-color: #8c8c8c21;
    overflow: hidden;
    z-index: -5;
    margin-top: 180px;

    .prize-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0 auto;
      position: relative;
    }

    .prize-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 10%;
      height: 157px;
      font-size: 50px;
      color: #163d4f;
      font-weight: bold;
      padding-left: 10%;
      z-index: 999;
    }

    .prize-title:nth-child(2) {
      width: 26%;
      margin-right: 350px;
      font-size: 32px;
    }

    .prize-item {
      font-size: 52px;
      color: #bb1414;
      // text-decoration: underline;
    }
  }
  .prize-background {
    width: 100vw;
    // height: 237px;
    position: absolute;

    i {
      font-size: 3rem;
      // color: #f0f0ff;
      color: #9ebffc;
      position: absolute;
    }

    i:nth-child(1) {
      bottom: 30px;
      left: 40px;
      transform: rotate(0deg);
    }

    i:nth-child(2) {
      top: 40px;
      left: 30px;
      transform: rotate(20deg);
    }

    i:nth-child(3) {
      bottom: -40px;
      left: 130px;
      transform: rotate(-20deg);
    }

    i:nth-child(4) {
      top: -25px;
      left: 550px;
      transform: rotate(-30deg);
    }

    i:nth-child(5) {
      bottom: 20px;
      left: 340px;
      transform: rotate(0deg);
    }

    i:nth-child(6) {
      top: -100px;
      right: 300px;
      transform: rotate(0deg);
    }

    i:nth-child(7) {
      bottom: -35px;
      right: 200px;
      transform: rotate(40deg);
    }

    i:nth-child(8) {
      bottom: 35px;
      right: 50px;
      transform: rotate(-20deg);
    }

    i:nth-child(9) {
      top: 100px;
      right: 100px;
      transform: rotate(20deg);
    }
  }
  // $i: 30;
  // 抽完獎雪花畫面動畫
  @for $i from 1 through 9 {
    $size: random(100) + 1000;

    .prize-background i:nth-child(odd) {
      animation: move 3s alternate infinite ease-in-out !important;
      animation-delay: $i * 0.2s !important;
    }

    .prize-background i:nth-child(even) {
      animation: move 2s alternate-reverse infinite ease-in-out !important;
    }
  }
  // 雪花動畫
  @keyframes move {
    @for $i from 1 through 9 {
      10% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }

      20% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      30% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      40% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      50% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      60% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      70% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      80% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
      90% {
        transform: rotate((random(10) * 1deg)) scale(random(1) * 0.8);
      }
    }
  }

  // 新版轉盤
  .lucky-wheel {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 650px;
    height: 650px;
    border-radius: 650px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    z-index: 99;
    overflow: hidden;
  }
  // 外框樣式
  .lucky-wheel::after {
    content: '';
    width: 649px;
    height: 649px;
    background-image: url('../assets/newWheel/wheel-outside.svg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
  }

  .lucky-wheel .container {
    display: block;
    width: 620px;
    height: 620px;
    border-radius: 620px;
    overflow: hidden;
    position: relative;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  // 中心點文字顏色
  .pointer-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 128px;
    height: 208px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    z-index: 9999;
    position: absolute;
    color: #ff00ba;
    font-size: 2rem;
  }

  // 中心點的樣式
  .pointer-container::after {
    display: block;
    content: 'PRESS';
    width: 120px;
    height: 120px;
    border-radius: 120px;
    background-color: #1f1172;
    line-height: 120px;
    text-align: center;
    font-weight: bold;
    font-size: 1.7rem;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    // box-shadow: 10px 0px 40px rgba(255, 241, 241, 0.833);
  }

  // Press按壓下去立體感
  .pointer-container:active::after {
  // transform: translateY(0px);
  // box-shadow: 10px 10px 15px rgba(53, 245, 255, 0.728);
  background-color: #0b0f50;
}
 // Press按壓下去立體感
 .pointer-container:active {
  transform: translateY(4px);
}

  // 紫色箭頭圈圈樣式
  .pointer-container .pointer {
    width: 128px;
    height: 208px;
    display: block;
    background-image: url('../assets/newWheel/hand.svg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    bottom: 39.7px;
    // -webkit-transform-origin: 64px 144px;
    transform-origin: 64px 144px;
    cursor: pointer;
  }
  .item {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 50%;
    height: 50%;
    border: 1px solid #1f1172;
    top: 0;
    right: 0;
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .item-skew:nth-child(1) {
    -webkit-transform: rotate(45deg) skewY(-45deg);
    transform: rotate(45deg) skewY(-45deg);
    // background-image: url('../assets//backGround/greenBag.png');
    // background-repeat: no-repeat;
    // background-size: 360px 100px;
    // width: 100px;
    // height: 100px;
  }
  .item-skew:nth-child(2) {
    -webkit-transform: rotate(90deg) skewY(-45deg);
    transform: rotate(90deg) skewY(-45deg);
  }

  .item-skew:nth-child(3) {
    -webkit-transform: rotate(135deg) skewY(-45deg);
    transform: rotate(135deg) skewY(-45deg);
  }

  .item-skew:nth-child(4) {
    -webkit-transform: rotate(180deg) skewY(-45deg);
    transform: rotate(180deg) skewY(-45deg);
  }

  .item-skew:nth-child(5) {
    -webkit-transform: rotate(225deg) skewY(-45deg);
    transform: rotate(225deg) skewY(-45deg);
  }

  .item-skew:nth-child(6) {
    -webkit-transform: rotate(270deg) skewY(-45deg);
    transform: rotate(270deg) skewY(-45deg);
  }
  .item-skew:nth-child(7) {
    -webkit-transform: rotate(315deg) skewY(-45deg);
    transform: rotate(315deg) skewY(-45deg);
  }
  .item-skew:nth-child(8) {
    -webkit-transform: rotate(360deg) skewY(-45deg);
    transform: rotate(360deg) skewY(-45deg);
  }
  // 獎項名稱+編號位置
  .item-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 70px;
    height: 50px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    font-size: 1.2rem;
    font-weight: bold;
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-transform: skewY(30deg) rotate(30deg) translate(-95px, 62px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    position: absolute;
    right: 90px;
    bottom: -20px;
    font-weight: bold !important;
  }
  // 獎品編號
  .item-content .count {
    position: absolute;
    left: 10px;
    top: 70px;
    font-size: 1rem;
    text-align: center;
    width: 45px;
    line-height: 25px;
    border-radius: 30px;
    display: block;
  }
  .item-content > i {
    font-size: 4rem;
  }

  .item:nth-child(odd) {
    background-color: #343baa;
  }

  .item:nth-child(odd) .item-content {
    color: #f0beff;
  }

  .item:nth-child(odd) .count {
    color: #343baa;
    background-color: #f0beff;
  }

  // 獎品圖片
  .item:nth-child(1) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/greenBag.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(2) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/goldcoins_bag.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(3) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/treasure.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(4) .prize_Img {
    position: absolute;
    right: 70px;
    top: 200px;
    background-image: url('../assets/backGround/ticket.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(5) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/ticket3.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(6) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/ticket2.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(7) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/ticket2.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }
  .item:nth-child(8) .prize_Img {
    position: absolute;
    right: 50px;
    top: 180px;
    background-image: url('../assets/backGround/ticket2.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    -webkit-transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    transform: skewY(45deg) rotate(20deg) translate(-95px, 92px);
    width: 100px;
    height: 150px;
  }

  .item:nth-child(even) {
    background-color: #f0beff;
  }

  .item:nth-child(even) .item-content {
    color: #343baa;
  }

  .item:nth-child(even) .count {
    color: #f0beff;
    background-color: #343baa;
  }
  // 選種獎項樣式
  .item.active {
    background-color: #ff00ba;
    -webkit-transition: 0.2s ease-in;
    transition: 0.2s ease-in;
  }

  .item.active .item-content {
    color: white;
    -webkit-transition: 0.2s ease-in;
    transition: 0.2s ease-in;
  }
  </style>

  <style lang="scss">
  pre {
    color: white;
    font-size: 18px;
    font-weight: bold;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    white-space: break-word;
  }
  .banner_style {
    border-radius: 50px !important;
    max-height: 100%;
    max-width: 100%;
    width: 800px;
    // height: 400px;
    margin: auto;
  }
  // 抽獎彈窗
  .drawModel_style {
    background: #fff !important;
    font-size: 20px;
    font-weight: bold;
    border-radius: 20px;
    & .el-dialog__header {
      background: linear-gradient(90deg, rgba(238, 149, 179, 1) 17%, rgba(244, 82, 96, 0.770920868347339) 52%, rgba(201, 142, 244, 0.8073354341736695) 100%);
      margin-right: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    & .el-dialog__title {
      font-size: 30px;
      font-weight: bold;
      color: #fff;
    }
  }

  // 抽獎紀錄彈窗
  .loginHistory_style {
    background: linear-gradient(270deg, rgba(238, 149, 179, 1) 0%, rgb(159, 28, 188) 0%, rgba(35, 7, 64, 1) 100%) !important;
    font-size: 20px;
    font-weight: bold;
    border-radius: 20px;
    & .el-dialog__title {
      font-size: 30px;
      font-weight: bold;
      color: #fff;
    }
  }
  .loginHyTable_style {
    width: 100%;
    // margin: auto;
  }
  .loginHyTable_style .el-table__header-wrapper {
    border-radius: 15px;
  }
  .loginHyTable_style .el-table,
  .el-table__expanded-cell {
    background-color: transparent;
  }
  .loginHyTable_style .el-table th {
    border-bottom: none !important;
    padding-top: 10px;
  }
  .loginHyTable_style .el-table tr {
    background-color: transparent !important;
    color: white;
  }
  // 更改表格hover背景色
  .loginHyTable_style .el-table__body tr:hover {
    border-radius: 15px !important;
  }
  .loginHyTable_style .el-table__body tr:hover > td {
    background-color: #2a5595 !important;
  }
  .loginHyTable_style .el-table--enable-row-transition .el-table__body td,
  .el-table .cell {
    background-color: transparent;
    border: none !important; //去掉表格的底線
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
  .loginHyTable_style :deep(.el-table::before) {
    //去除底部白线
    height: 0px !important;
    background-color: transparent !important;
  }

  .codeForm_style {
    display: block;
    & .el-form-item__label {
      font-size: 18px !important;
    }
  }

  /*輸入序號Btn CSS */
  .button-72 {
    align-items: center;
    background-color: initial;
    background-image: linear-gradient(rgba(179, 132, 201, 0.84), rgba(119, 71, 181, 0.84) 50%);
    border-radius: 42px;
    border-width: 0;
    box-shadow: rgba(57, 31, 91, 0.24) 0 2px 2px, rgba(179, 132, 201, 0.4) 0 8px 12px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: Quicksand, sans-serif;
    font-size: 18px;
    font-weight: 700;
    justify-content: center;
    letter-spacing: 0.04em;
    line-height: 16px;
    margin: 0;
    padding: 18px 18px;
    text-align: center;
    text-decoration: none;
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 4px, rgba(255, 255, 255, 0.2) 0 0 12px, rgba(57, 31, 91, 0.6) 1px 1px 4px, rgba(57, 31, 91, 0.32) 4px 4px 16px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
  }

  .button-72:hover {
    background-image: linear-gradient(#b384c9, #391f5b 50%);
    transition: 0.5ms;
  }

  /*歷史紀錄Btn CSS */
  .button-73 {
    align-items: center;
    background-color: initial;
    background-image: linear-gradient(90deg, rgba(238, 149, 179, 1) 0%, rgba(199, 30, 45, 0.770920868347339), rgba(71, 1, 15, 0.8073354341736695) 100%);
    border-radius: 42px;
    border-width: 0;
    box-shadow: rgba(57, 31, 91, 0.24) 0 2px 2px, rgba(179, 132, 201, 0.4) 0 8px 12px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: Quicksand, sans-serif;
    font-size: 18px;
    font-weight: 700;
    justify-content: center;
    letter-spacing: 0.04em;
    line-height: 16px;
    margin: 0;
    padding: 18px 18px;
    text-align: center;
    text-decoration: none;
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 4px, rgba(255, 255, 255, 0.2) 0 0 12px, rgba(59, 5, 13, 1) 56% 1px 1px 4px, rgba(129, 15, 25, 0.770920868347339) 4px 4px 16px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
  }

  .button-73:hover {
    background-image: linear-gradient(#b384c9, #3b050d 50%);
    transition: 0.5ms;
  }
  .swalBody {
    border-radius: 30px;
    background-color: #ffffff;
  }
  @media (max-width: 800px) {
    .banner_style {
      width: 550px !important;
    }
  }
  @media (min-width: 768px) {
    .button-72 {
      font-size: 21px;
      padding: 18px 34px;
    }
  }
  @media (max-width: 600px) {
    .banner_style {
      width: 350px !important;
    }
    .line_btn {
      min-width: 160px !important;
      font-size: 16px !important;
    }
    .game_btn {
      min-width: 160px !important;
      font-size: 16px !important;
    }
    .phone_style {
      flex-direction: column;
      & .phone_inputKey {
        display: flex;
        margin-top: 20px;
        & .button-72 {
          margin-right: 20px !important;
          padding: 18px 40px;
        }
        & .button-73 {
          margin-left: 20px !important;
          padding: 18px 40px;
        }
      }
    }
    .drawModel_style {
      width: 350px !important;
    }
    .drawModel_style .el-dialog__title {
      font-size: 24px !important;
    }
    // 中獎說明 & 活動說明 字體大小
    pre {
      font-size: 14px !important;
    }
    // 中獎紀錄談窗
    .loginHistory_style {
      width: 370px !important;
      & .el-dialog__close {
        color: #fff !important;
      }
    }

    // 轉盤樣式
    .lucky-wheel {
      width: 350px !important;
      height: 350px !important;
      border-radius: 400px !important;
    }
    .lucky-wheel::after {
      content: '';
      width: 350px !important;
      height: 350px !important;
      background-image: url('../assets/newWheel/wheel-outside.svg');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      position: absolute;
    }
    .pointer-container {
      width: 128px;
      height: 208px;
      font-size: 0.8rem !important;
    }
    .pointer-container::after {
      width: 55px !important;
      height: 55px !important;
      border-radius: 50px !important;
      line-height: 57px !important;
      font-size: 0.8rem !important;
    }
    .pointer-container .pointer {
      // width: 58px !important;
      // height: 95px !important;
      // bottom: 72.7px !important;
      // transform-origin: 29px 66px !important;

      width: 60px !important;
      height: 97px !important;
      bottom: 72.7px !important;
      transform-origin: 30px 67.5px !important;
    }
    .item-content {
      // width: 80px !important;
      font-size: 0.7rem !important;
      right: 5px !important;
      bottom: -25px !important;
      height: 10px !important;
    }
    .item-content .count {
      left: 0px !important;
      top: 5px !important;
      width: 25px !important;
      line-height: 20px !important;
    }
    // .item:nth-child(odd) .prize_Img {
    //   right: -15px !important;
    //   top: 230px !important;
    //   width: 90px !important;
    // }
    .item:nth-child(1) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(2) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(3) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(4) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(5) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(6) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(7) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
    .item:nth-child(8) .prize_Img {
      right: 5px !important;
      top: 245px !important;
      width: 70px !important;
    }
  }
  @media (min-width: 576px) {
    .container {
      max-width: 600px !important;
    }
  }
  // @media (max-width: 648px) {
  //   .lucky-wheel {
  //     width: 400px !important;
  //     height: 400px !important;
  //     border-radius: 400px !important;
  //   }
  //   .lucky-wheel::after {
  //     content: '';
  //     width: 400px !important;
  //     height: 400px !important;
  //     background-image: url('../assets/newWheel/wheel-outside.svg');
  //     background-position: center;
  //     background-size: cover;
  //     background-repeat: no-repeat;
  //     position: absolute;
  //   }
  //   .pointer-container {
  //     width: 128px;
  //     height: 208px;
  //     font-size: 1rem !important;
  //   }
  //   .pointer-container::after {
  //     width: 60px !important;
  //     height: 60px !important;
  //     border-radius: 60px !important;
  //     line-height: 60px !important;
  //   }
  //   .pointer-container .pointer{
  //     width: 64px  !important;
  //     height: 100px !important;
  //     bottom: 70.7px !important;
  //   }
  // }
  </style>

import { observable, action, computed, decorate, runInAction } from "mobx";
import { BIZ_TYPE, INNER_CODE } from 'Common/config/params.enum';
import { apiBankAll } from 'Common/api/bank';
const apiBank = new apiBankAll.ApiBankV2();
import { session } from "Common/utils/store";
import apiRealName from "Common/api/realname";
import { commonStore } from "Common/pages/store"

class Store {
  @observable questionData:any[] = []
  @observable isAnswers = false
  @observable result = {}
  @observable gradeName = ''
  @observable text = ''

  @action.bound
  async getRiskQuestionFn() {
    let res = await apiBank.getRiskAppraisalQuestions()
    runInAction(()=>{
      this.questionData = res;
    })
  }

  @action.bound
  // 风险问题提交按钮
  riskQuestionBtn = async (questionData?: Array<any extends object ? DeepRequired<any> : any>) => {
    let data = session.get('itemNum');
    let sumArr: any[] = [];
    let riskOptions = '';

    // 遍历答案下标的数组，返回对应的选项ABCD
    if (this.isAnswers) {
      data.map((item: string | number, ind: number) => {
        switch (item) {
          case 0:
            riskOptions += 'A';
            break;
          case 1:
            riskOptions += 'B';
            break;
          case 2:
            riskOptions += 'C';
            break;
          case 3:
            riskOptions += 'D';
            break;
          case 4:
            riskOptions += 'E';
            break;
        }
        sumArr.push(questionData![ind].options[item].score)
      })
      var riskQuestionAnswer = riskOptions.split("").join(",")
    } else {
      data.map((item: string | number, ind: number) => {
        switch (item) {
          case 0:
            riskOptions += (ind + 1) + '_A,';
            break;
          case 1:
            riskOptions += (ind + 1) + '_B,';
            break;
          case 2:
            riskOptions += (ind + 1) + '_C,';
            break;
          case 3:
            riskOptions += (ind + 1) + '_D,';
            break;
          case 4:
            riskOptions += (ind + 1) + '_E,';
            break;
        }
        sumArr.push(questionData![ind].options[item].score)
      })
      let newRiskOptions = riskOptions.split(",");
      var riskQuestionAnswer = newRiskOptions.splice(0, newRiskOptions.length - 1).join(",") // 得到结果，然后发起请求
    }

    // 传递参数（答案）
    let { idName, idNumber }: any = await apiRealName.BcSuccessIdcard({ isShowIdPhoto: false })
    await apiBank.riskAppraisalAnswer({
      "riskAnswer": riskQuestionAnswer,
      "score": sumArr.join(','),
      username: idName,
      idNo: idNumber
    }).then((data: { gradeName?: any; text?: any; grade?: any; }) => {
      runInAction(() => {
        this.result = data
        this.gradeName = data.gradeName
        this.text = data.text
        commonStore.Hash.history.push('/assessmentLevel?gradeName=' + this.gradeName + "&text=" + `${this.text ? this.text : ""}` + "&grade=" + data.grade)
      })
    })
  }
}
export default Store

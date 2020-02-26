import React, { useEffect, useState, useContext } from 'react';
import { Headers, BcButton, BottomColumn } from 'Common/publicCommon/index';
import BcRadio from 'Common/publicCommon/BcRadio/index';
import { session } from "Common/utils/store";
import { InitCom } from "./index";
import { observer } from "mobx-react-lite"

function Render() {
  let { Config, Store } = InitCom.get();

  useEffect(() => {
    let { getRiskQuestionFn } = Store
    getRiskQuestionFn()
  })

  // let { questionData } = Config;
  let [radioIndex, setRadioIndex] = useState([])
  let [questionNum, setQuestionNum] = useState(0)

  let { questionData, riskQuestionBtn } = Store

  function redioIndexChange(i: number, ind?: any) {
    let indexList:any = [...radioIndex]
    indexList[i] = ind;
    setRadioIndex(indexList)
    session.set('itemNum', indexList)
  }

  function prevQuestions() {
    setQuestionNum(questionNum - 1)
  }

  function nextQuestions() {
    if(radioIndex[questionNum] !== undefined) {
      setQuestionNum(+questionNum + 1)
    }
  }

  return <div className='riskQuestionsBox'>
    {/* 头部 */}
    <Headers>风险测评</Headers>
    {/* 风险问题 */}
    <section>
      <div className='riskQuestions'>
        <p className='questionNumber'>
          <b>{questionNum + 1}</b>
          <span>/{questionData.length}</span>
        </p>
        {/* 风险问题选项 */}

        <div>
          <div className='questionBox'>
            <h5 className='title'>
              {questionData[questionNum].questionContent}
            </h5>
            <div className='questionList'>
              <ul>
                {
                  questionData[questionNum].options.map((questItem: { optionNum: React.ReactNode; option: React.ReactNode; }, ind: string | number | undefined) => {
                    return <li key={ind} onClick={()=>{redioIndexChange(questionNum, ind)}}>
                      {/* 传递默认的是否选中来控制选中状态，并传递onChange事件来得到每一个单选按钮的值 */}
                      <BcRadio
                        key={ind}
                        defaultChecked={ind == radioIndex[questionNum]}
                        onChange={()=>{redioIndexChange(questionNum, ind)}}
                      />
                      <p>
                        <span> {questItem.optionNum}</span>
                        {questItem.option}
                      </p>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <TabQuestion {...{radioIndex, questionNum, questionData, prevQuestions, nextQuestions}}/>
        {/* 提交 */}
        <div className={`riskQuestion-confirm ${questionNum == questionData.length-1 ? 'next' : 'none'}`}>
          <BcButton isDisabled={radioIndex.length!==3} onClick={()=>{riskQuestionBtn(questionData)}}>提交</BcButton>
        </div>
      </div>
    </section>
    <BottomColumn type="long" />
  </div>
}

{/* 上一题下一题 */}
export let TabQuestion = (props: { radioIndex: any; questionNum: any; questionData: any; prevQuestions: any; nextQuestions: any; }) => {
  let {radioIndex, questionNum, questionData, prevQuestions, nextQuestions} = props;

  return <>
    <p className='upDown_question'>
      <span
        className={questionNum != 0 ? 'last' : 'none'}
        onClick={()=>{prevQuestions()}}
      >
        上一题
      </span>
      {
        questionNum == 0 || questionNum != questionData.length - 1 ?
          <span
            className={radioIndex != [] ? 'next' : 'show'}
            onClick={()=>{nextQuestions()}}
          >
            下一题
          </span>  :
          null
      }
    </p>
  </>
}


export default {
  TabQuestion,
  Render:observer(Render)
}

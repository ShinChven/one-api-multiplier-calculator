import React, { useState } from 'react';
import './Calculator.css';
import defaultData from './default-data';
import BigNumber from 'bignumber.js';
import { stringify, parse} from 'json-bignumber';
import JSONHighlighter from './JSONHighlighter';

type RowData = {
  modelName: string;
  inputPrice: BigNumber;
  outputPrice: BigNumber;
  modelMultiplier: BigNumber;
  completionMultiplier: BigNumber;
  editing: boolean;
  originalValues: {
    modelName: string;
    inputPrice: BigNumber;
    outputPrice: BigNumber;
  } | null;
};

function calculateMultipliers(inputPrice: BigNumber, outputPrice: BigNumber, isPerMillion: boolean) {
  if (inputPrice.isNaN() || outputPrice.isNaN()) {
    throw new Error('输入和输出价格必须是数字');
  }

  if (inputPrice.isZero()) {
    throw new Error('输入价格不能为零以计算倍率');
  }

  const basePrice = isPerMillion ? new BigNumber(2) : new BigNumber(0.002); // 根据单位调整基础价格
  const modelMultiplier = new BigNumber(inputPrice).div(basePrice);
  const completionMultiplier = new BigNumber(outputPrice).div(new BigNumber(inputPrice))

  return {
    modelMultiplier,
    completionMultiplier
  };
}

const Calculator: React.FC = () => {
  const localStorageKey = 'calculatorData';
  const unitStorageKey = 'isPerMillion'; // Key for storing the unit preference
  const [isPerMillion, setIsPerMillion] = useState<boolean>(() => {
    const storedUnit = localStorage.getItem(unitStorageKey);
    return storedUnit ? parse(storedUnit) : false; // Default to 1K if no preference is stored
  });
  const [rows, setRows] = useState<RowData[]>(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (!storedData) {
      const initialData = defaultData.map((row: any) => {
        const { modelMultiplier, completionMultiplier } = calculateMultipliers(row.inputPrice, row.outputPrice, isPerMillion);
        return {
          ...row,
          modelMultiplier,
          completionMultiplier,
          originalValues: null
        };
      });
      localStorage.setItem(localStorageKey, stringify(initialData));
      return initialData;
    }
    return parse(storedData).map((row: any) => ({
      ...row,
      originalValues: row.editing ? {
        modelName: row.modelName,
        inputPrice: row.inputPrice,
        outputPrice: row.outputPrice,
      } : null
    }));
  });

  const [modelMultiplierJsonString, setModelMultiplierJsonString] = useState('');
  const [completionMultiplierJsonString, setCompletionMultiplierJsonString] = useState('');

  const convertPrices = (rows: RowData[], toMillion: boolean) => {
    const conversionFactor = toMillion ? 1000 : 0.001; // 在1k和1M Tokens之间转换价格
    return rows.map(row => ({
      ...row,
      inputPrice: row.inputPrice.multipliedBy(conversionFactor), // Prevent strange numbers
      outputPrice: row.outputPrice.multipliedBy(conversionFactor), // Prevent strange numbers
    }));
  };

  const toggleUnit = () => {
    const newIsPerMillion = !isPerMillion;
    const newRows = convertPrices(rows, newIsPerMillion);
    setRows(newRows);
    setIsPerMillion(newIsPerMillion);
    localStorage.setItem(localStorageKey, stringify(newRows.map(row => ({ ...row, originalValues: null }))));
    localStorage.setItem(unitStorageKey, stringify(newIsPerMillion)); // Store the unit preference
  };

  const resetData = () => {
    if (window.confirm("您确定要重置数据吗？此操作无法撤销。")) {
      localStorage.removeItem(localStorageKey);
      localStorage.removeItem(unitStorageKey); // Also clear the unit preference
      setIsPerMillion(false); // Reset unit to 1K
      setRows(defaultData.map((row: any) => {
        const { modelMultiplier, completionMultiplier } = calculateMultipliers(row.inputPrice, row.outputPrice, false);
        return {
          ...row,
          modelMultiplier,
          completionMultiplier,
          originalValues: null
        };
      }));
    }
  };

  const addRow = () => {
    setRows(prevRows => [...prevRows, {
      modelName: '',
      inputPrice: new BigNumber(0),
      outputPrice: new BigNumber(0),
      modelMultiplier: new BigNumber(0),
      completionMultiplier: new BigNumber(0),
      editing: true,
      originalValues: null,
    }]);
    // Scroll to the bottom of the page
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const generateJSON = () => {
    const storedData = localStorage.getItem(localStorageKey);
    if (!storedData) {
      return
    }
    const storedDataObject = parse(storedData)
    const modelMultiplier: Record<string, BigNumber> = {};
    const completionMultiplier: Record<string, BigNumber> = {};
    for (const data of storedDataObject) {
      modelMultiplier[data.modelName] = data.modelMultiplier
      completionMultiplier[data.modelName] = data.completionMultiplier
    }
    const modelMultiplierJsonStringVar = stringify(modelMultiplier, null, 4)
    const completionMultiplierJsonStringVar = stringify(completionMultiplier, null, 4)
    setModelMultiplierJsonString(modelMultiplierJsonStringVar)
    setCompletionMultiplierJsonString(completionMultiplierJsonStringVar)
    console.log("模型倍率：", modelMultiplierJsonString)
    console.log("补全倍率：", completionMultiplierJsonString)
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: field === 'modelName' ? value : new BigNumber(value) || new BigNumber(0)
    };

    if (field === 'inputPrice' || field === 'outputPrice') {
      const { inputPrice, outputPrice } = newRows[index];
      try {
        const { modelMultiplier, completionMultiplier } = calculateMultipliers(inputPrice, outputPrice, isPerMillion);
        newRows[index] = { ...newRows[index], modelMultiplier, completionMultiplier };
      } catch (error: any) {
        console.error(error.message);
        newRows[index] = { ...newRows[index], modelMultiplier: new BigNumber(0), completionMultiplier: new BigNumber(0) };
      }
    }

    setRows(newRows);
  };

  const toggleEdit = (index: number) => {
    const newRows = [...rows];
    if (!newRows[index].editing) {
      newRows[index].originalValues = {
        modelName: newRows[index].modelName,
        inputPrice: newRows[index].inputPrice,
        outputPrice: newRows[index].outputPrice,
      };
    }
    newRows[index].editing = !newRows[index].editing;

    if (!newRows[index].editing) {
      localStorage.setItem(localStorageKey, stringify(newRows.map(row => ({ ...row, originalValues: null }))));
    }

    setRows(newRows);
  };

  const cancelEdit = (index: number) => {
    const newRows = [...rows];
    if (newRows[index].originalValues) {
      newRows[index] = {
        ...newRows[index],
        ...newRows[index].originalValues,
        editing: false,
        originalValues: null,
      };
    } else {
      newRows.splice(index, 1); // 删除未保存的新增行
    }
    setRows(newRows);
  };

  const deleteRow = (index: number) => {
    if (window.confirm('确定要删除这行吗？')) {
      setRows(prevRows => prevRows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container">
      <h1>One-API 模型定价倍率计算器</h1>
      <div className="card">
        <div style={{ textAlign: 'left' }}>
          <p>
            <a href="https://github.com/songquanpeng/one-api" target="_blank" rel="noopener noreferrer">One-API</a> 是一个开源的 AI API 聚合程序，它支持 OpenAI、Google、Anthropic 等多个 API 提供商。One-API 通过一个统一的 API 接口，让用户可以方便地在不同的 API 提供商之间切换，并且提供用户计费功能，可以为每个用户的 API 请求计算价格。
          </p>
          <p>
            倍率：在 One-API 的模型定价体系中，以 $0.002 1K tokens 为1倍，换算成 1M tokens 为 $2。补全倍率：补全倍率是指输出为输入的倍率，即输出的价格是输入的倍数。例如，输入价格为 $10，输出价格为 $30，那么输出价格是输入价格的 3 倍，补全倍率为 3。用户分组倍率： One-API 的运行和维护需要一定的服务器成本，因此可以设置一个分组倍率让相关用户在使用时分摊这部分成本。
          </p>
          <p>
            公式：额度 = 分组倍率 * 模型倍率 * （提示 token 数 + 补全 token 数 * 补全倍率）
          </p>
          <p>
            这里放一个多模型 token 计费参考：<a href="https://docsbot.ai/tools/gpt-openai-api-pricing-calculator" target="_blank" rel="noopener noreferrer">https://docsbot.ai/tools/gpt-openai-api-pricing-calculator</a>
          </p>
          <p>
            数据存在你的浏览器中了。
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}>价格基于每 {isPerMillion ? '1M' : '1K'} 个 Token 进行计算</p>
            <div>
              <button onClick={toggleUnit} style={{ color: 'black' }}>切换为 {isPerMillion ? '1K' : '1M'}</button>
              <button onClick={resetData} style={{ color: 'red', marginLeft: '10px' }}>重置数据</button>
              <button onClick={addRow} style={{ color: 'black' }}>添加模型</button>
              <button onClick={generateJSON} style={{ color: 'black' }}>生成 One-API 模型倍率和补全倍率JSON</button>
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>模型名称</th>
              <th>输入价格</th>
              <th>输出价格</th>
              <th>模型倍率</th>
              <th>补全倍率</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.editing ? (
                    <input
                      type="text"
                      value={row.modelName}
                      onChange={(e) => handleInputChange(index, 'modelName', e.target.value)}
                    />
                  ) : (
                    <span>{row.modelName}</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      type="text"
                      value={row.inputPrice.toString()}
                      onChange={(e) => handleInputChange(index, 'inputPrice', e.target.value)}
                    />
                  ) : (
                    <span>{row.inputPrice.toString()}</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      type="text"
                      value={row.outputPrice.toString()}
                      onChange={(e) => handleInputChange(index, 'outputPrice', e.target.value)}
                    />
                  ) : (
                    <span>{row.outputPrice.toString()}</span>
                  )}
                </td>
                <td>{row.modelMultiplier.toString()}</td>
                <td>{row.completionMultiplier.toString()}</td>
                <td>
                  <div className="action-buttons">
                    {row.editing ? (
                      <>
                        <button onClick={() => toggleEdit(index)}>💾</button>
                        <button onClick={() => cancelEdit(index)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggleEdit(index)}>✏️</button>
                        <button onClick={() => deleteRow(index)}>🗑️</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-button-container">
          <button onClick={addRow}>➕</button>
        </div>
        <div className="json-text-container">
          模型倍率：<br />
          {/* <pre><code className="language-json">{modelMultiplierJsonString}</code></pre> */}
          <JSONHighlighter json={modelMultiplierJsonString}></JSONHighlighter>
          <br />
          补全倍率：<br />
          {/* <pre><code className="language-json">{completionMultiplierJsonString}</code></pre> */}
          <JSONHighlighter json={completionMultiplierJsonString}></JSONHighlighter>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="https://github.com/ShinChven/one-api-multiplier-calculator" target="_blank" rel="noopener noreferrer">
          GitHub 仓库
        </a>
      </div>
    </div>
  );
};

export default Calculator;

import { Tree, TreeDeciduous } from 'lucide-react';
import React, { useState } from 'react';

// This function would need to be implemented to parse the scikit-learn tree
const parseSciKitTree = (treeString) => {
  const lines = treeString.split('\n');
  let tree = {};
  let currentNode = tree;
  let stack = [];

  for (let line of lines) {
    const depth = line.search(/\S/);
    const parts = line.trim().split(' ');

    if (parts[0] === 'if') {
      const newNode = {
        question: parts[1],
        options: []
      };

      while (stack.length > depth) {
        stack.pop();
      }

      if (stack.length > 0) {
        stack[stack.length - 1].options.push(newNode);
      } else {
        tree = newNode;
      }

      stack.push(newNode);
      currentNode = newNode;
    } else if (parts[0] === 'class:') {
      currentNode.options.push({
        value: parts[1],
        result: parts[1]
      });
    }
  }

  return tree;
};

const DecisionTreeNavigator = () => {
  const [decisionTree, setDecisionTree] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [path, setPath] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const treeString = e.target.result;
        const parsedTree = parseSciKitTree(treeString);
        setDecisionTree(parsedTree);
        setCurrentNode(parsedTree);
        setPath([]);
      };
      reader.readAsText(file);
    }
  };

  const handleChoice = (option) => {
    if (option.next) {
      setCurrentNode(option.next);
      setPath([...path, { question: currentNode.question, answer: option.value }]);
    } else {
      setPath([...path, { question: currentNode.question, answer: option.value }]);
    }
  };

  const resetTree = () => {
    setCurrentNode(decisionTree);
    setPath([]);
  };

  if (!decisionTree) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <Tree className="mr-2" />
          Decision Tree Navigator
        </h1>
        <label className="block mb-4">
          <span className="sr-only">Choose file</span>
          <input type="file" className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
            onChange={handleFileUpload}
          />
        </label>
        <p className="text-sm text-gray-500">Upload your scikit-learn decision tree file to begin</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Tree className="mr-2" />
        Decision Tree Navigator
      </h1>

      {path.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Your path:</h2>
          {path.map((step, index) => (
            <p key={index} className="text-sm">
              {step.question}: <span className="font-medium">{step.answer}</span>
            </p>
          ))}
        </div>
      )}

      {currentNode?.question ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">{currentNode.question}</h2>
          <div className="space-y-2">
            {currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option)}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Result: {path[path.length - 1]?.answer}</p>
          <button
            onClick={resetTree}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center mx-auto"
          >
            <TreeDeciduous className="mr-2" />
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default DecisionTreeNavigator;

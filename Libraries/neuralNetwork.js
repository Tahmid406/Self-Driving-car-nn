//Activation function
const sigmoid = (x) => {
  return 1 / (1 + Math.exp(-x));
};

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.ih_weights = this.generateWeights(this.input_nodes, this.hidden_nodes);
    this.ho_weights = this.generateWeights(this.hidden_nodes, this.output_nodes);

    this.bias_h = this.generateWeights(1, this.hidden_nodes);
    this.bias_o = this.generateWeights(1, this.output_nodes);
  }

  feedForward(inputs) {
    inputs = this.fromArr(inputs);
    let hidden_node_values = math.multiply(this.ih_weights, inputs);
    hidden_node_values = math.add(hidden_node_values, this.bias_h);
    hidden_node_values = hidden_node_values.map(sigmoid);

    let output_node_values = math.multiply(this.ho_weights, hidden_node_values);
    output_node_values = math.add(output_node_values, this.bias_o);
    output_node_values = output_node_values.map(sigmoid);

    return this.toArr(output_node_values);
  }

  copy() {
    let newnn = new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
    newnn.ih_weights._data = this.ih_weights._data.map((arr) => arr.slice());
    newnn.ho_weights._data = this.ho_weights._data.map((arr) => arr.slice());
    newnn.bias_h._data = this.bias_h._data.map((arr) => arr.slice());
    newnn.bias_o._data = this.bias_o._data.map((arr) => arr.slice());
    return newnn;
  }

  fromArr(arr) {
    let inp_matrix = [];
    for (let i = 0; i < arr.length; i++) {
      inp_matrix[i] = new Array(1);
      inp_matrix[i][0] = arr[i];
    }
    return math.matrix(inp_matrix);
  }

  toArr(matrix) {
    let matrix_data = matrix._data;
    let arr = [];
    for (let i = 0; i < matrix_data.length; i++) arr[i] = matrix_data[i][0];
    return arr;
  }

  //generate matrix of random Weights ranging from -1 to 1
  generateWeights(n_inputs, n_outputs) {
    let weight_matrix = new Array(n_outputs);
    for (let i = 0; i < n_outputs; i++) {
      weight_matrix[i] = new Array(n_inputs);
      for (let j = 0; j < n_inputs; j++) {
        weight_matrix[i][j] = Math.random() * 2 - 1;
      }
    }
    return math.matrix(weight_matrix);
  }
}

function setup() {
  let nn = new NeuralNetwork(2, 3, 2);

  let inputs = [1, 0];
  let targets = [1, 0];

  let b = nn.train(inputs, targets);
}

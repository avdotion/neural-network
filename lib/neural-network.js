class ActivationFunction {
  constructor(f, g) {
    this.f = f;
    this.g = g;
  }
}

const sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  x => x * (1 - x)
);

const tanh = new ActivationFunction(
  x => Math.tanh(x),
  x => 1 - (x * x)
);

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes, learning_rate=0.1, activation_function=sigmoid) {
    // Fully connected 3-layer network
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_input_hidden = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_hidden_output = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_input_hidden.randomize();
    this.weights_hidden_output.randomize();

    this.bias_hidden = new Matrix(this.hidden_nodes, 1);
    this.bias_output = new Matrix(this.output_nodes, 1);
    this.bias_hidden.randomize();
    this.bias_output.randomize();

    this.activation_function = activation_function;
    this.learning_rate = learning_rate;
  }

  predict(input_array) {
    const input_layer = Matrix.fromArray(input_array);

    const hidden_layer = Matrix.map(
      Matrix.add(
        Matrix.multiply(
          this.weights_input_hidden,
          input_layer
        ),
        this.bias_hidden
      ),
      this.activation_function.f
    );

    const output_layer = Matrix.map(
      Matrix.add(
        Matrix.multiply(
          this.weights_hidden_output,
          hidden_layer
        ),
        this.bias_output
      ),
      this.activation_function.f
    );

    return output_layer.toArray();
  }

  train(input_array, target_array) {
    const input_layer = Matrix.fromArray(input_array);
    const targets = Matrix.fromArray(target_array);

    const hidden_layer = Matrix.map(
      Matrix.add(
        Matrix.multiply(
          this.weights_input_hidden,
          input_layer
        ),
        this.bias_hidden
      ),
      this.activation_function.f
    );

    const output_layer = Matrix.map(
      Matrix.add(
        Matrix.multiply(
          this.weights_hidden_output,
          hidden_layer
        ),
        this.bias_output
      ),
      this.activation_function.f
    );

    const delta = Matrix.subtract(
      targets,
      output_layer
    );

    const gradients = Matrix.multiply(
      Matrix.multiply(
        delta,
        Matrix.map(
          output_layer,
          this.activation_function.g
        ),
        'hadamard'
      ),
      this.learning_rate
    );

    this.weights_hidden_output.add(
      Matrix.multiply(
        gradients,
        Matrix.transpose(hidden_layer)
      )
    );

    this.bias_output.add(gradients);

    const expression = Matrix.multiply(
      Matrix.multiply(
        Matrix.multiply(
          Matrix.transpose(this.weights_hidden_output),
          delta
        ),
        Matrix.map(
          hidden_layer,
          this.activation_function.g
        ),
        'hadamard'
      ),
      this.learning_rate
    );

    this.weights_input_hidden.add(
      Matrix.multiply(
        expression,
        Matrix.transpose(input_layer)
      )
    );

    this.bias_hidden.add(expression);
  }
}

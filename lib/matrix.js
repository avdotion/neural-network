class Matrix {
  constructor(rows, columns) {
    // https://en.wikipedia.org/wiki/Matrix_(mathematics)
    this.rows = rows;
    this.columns = columns;
    this.data = new Array(rows);

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = new Array(this.columns);
    }

    this.fill(0);
  }

  fill(pattern) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.data[i][j] = pattern;
      }
    }
  }

  copy() {
    const copied = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        copied.data[i][j] = this.data[i][j];
      }
    }
    return copied;
  }

  static transpose(matrix) {
    // https://en.wikipedia.org/wiki/Transpose
    const transposed = new Matrix(matrix.columns, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        transposed.data[j][i] = matrix.data[i][j];
      }
    }
    return transposed;
  }

  static map(matrix, callback) {
    const mapped = matrix.copy();
    for (let i = 0; i < mapped.rows; i++) {
      for (let j = 0; j < mapped.columns; j++) {
        mapped.data[i][j] = callback(mapped.data[i][j]);
      }
    }
    return mapped;
  }

  map(callback) {
    this.data = Matrix.map(this, callback).data;
  }

  randomize(min=-1, max=1) {
    this.map(item => Math.random() * (max - min) + min);
  }

  static add(matrix, entity) {
    // https://en.wikipedia.org/wiki/Matrix_addition
    let added = matrix.copy();
    try {
      if (typeof entity === 'number') {
        added.map(item => item + entity);
      } else if (entity instanceof Matrix) {
        if (added.rows === entity.rows && added.columns === entity.columns) {
          for (let i = 0; i < added.rows; i++) {
            for (let j = 0; j < added.columns; j++) {
              added.data[i][j] += entity.data[i][j];
            }
          }
        } else {
          throw 'The dimensions must be equal!';
        }
      } else {
        throw 'Entity is not a Constant or Matrix!';
      }
    } catch (e) {
      console.error(e);
    } finally {
      return added;
    }
  }

  add(entity) {
    this.data = Matrix.add(this, entity).data;
  }

  static subtract(matrix, entity) {
    let subtracted = matrix.copy();
    try {
      if (typeof entity === 'number') {
        subtracted.map(item => item - entity);
      } else if (entity instanceof Matrix) {
        if (subtracted.rows === entity.rows && subtracted.columns === entity.columns) {
          for (let i = 0; i < subtracted.rows; i++) {
            for (let j = 0; j < subtracted.columns; j++) {
              subtracted.data[i][j] -= entity.data[i][j];
            }
          }
        } else {
          throw 'The dimensions must be equal!';
        }
      } else {
        throw 'Entity is not a Constant or Matrix!';
      }
    } catch (e) {
      console.error(e);
    } finally {
      return subtracted;
    }
  }

  subtract(entity) {
    this.data = Matrix.subtract(this, entity).data;
  }

  static multiply(matrix, entity, product='dot') {
    // https://en.wikipedia.org/wiki/Matrix_multiplication
    let multiplied;
    try {
      if (typeof entity === 'number') {
        multiplied = matrix.copy();
        for (let i = 0; i < multiplied.rows; i++) {
          for (let j = 0; j < multiplied.columns; j++) {
            multiplied.data[i][j] *= entity;
          }
        }
      } else if (entity instanceof Matrix) {
        if (product === 'dot') {
          if (matrix.columns === entity.rows) {
            multiplied = new Matrix(matrix.rows, entity.columns);
            for (let i = 0; i < multiplied.rows; i++) {
              for (let j = 0; j < multiplied.columns; j++) {
                let sum = 0;
                for (let l = 0; l < matrix.columns; l++) {
                  sum += matrix.data[i][l] * entity.data[l][j]
                }
                multiplied.data[i][j] = sum;
              }
            }
          } else {
            throw 'A columns must be equal B rows!';
          }
        } else if (product === 'hadamard') {
          multiplied = new Matrix(matrix.rows, matrix.columns);
          if (matrix.rows === entity.rows && matrix.columns === entity.columns) {
            for (let i = 0; i < matrix.rows; i++) {
              for (let j = 0; j < matrix.columns; j++) {
                multiplied.data[i][j] = matrix.data[i][j] * entity.data[i][j];
              }
            }
          } else {
            throw 'The dimensions must be equal!';
          }
        }
      } else {
        throw 'Entity is not a Constant or Matrix!';
      }
    } catch (e) {
      console.error(e);
    } finally {
      return multiplied;
    }
  }

  multiply(entity) {
    this.data = Matrix.multiply(this, entity).data;
  }

  static fromArray(array) {
    const producedMatrix = new Matrix(array.length, 1);
    for (let i = 0; i < array.length; i++) {
      producedMatrix.data[i][0] = array[i];
    }
    return producedMatrix;
  }

  toArray() {
    const producedArray = new Array(this.rows * this.columns);
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        producedArray[index] = this.data[i][j];
        index++;
      }
    }
    return producedArray;
  }

  print() {
    console.table(this.data);
  }
}

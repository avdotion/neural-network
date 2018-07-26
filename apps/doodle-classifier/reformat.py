import numpy as np


name = 'pencil'
data = np.load(f'{name}.npy')
selected_data = data[:1000]

# for i in range(len(selected_data)):
#     for j in range(len(selected_data[i])):
#         if selected_data[i][j] > 0:
#             selected_data[i][j] = 255

#         if selected_data[i][j] == 0:
#             selected_data[i][j] = 255
#         else:
#             selected_data[i][j] = 0

selected_data.tofile(f'{name}.bin')

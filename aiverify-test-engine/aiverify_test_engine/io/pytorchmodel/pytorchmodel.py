from __future__ import annotations

from typing import Any, List, Tuple

from aiverify_test_engine.interfaces.imodel import IModel
from aiverify_test_engine.plugins.enums.model_plugin_type import ModelPluginType
from aiverify_test_engine.plugins.enums.plugin_type import PluginType
from aiverify_test_engine.plugins.metadata.plugin_metadata import PluginMetadata
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.nn.functional import softmax


# NOTE: Do not change the class name, else the plugin cannot be read by the system
class Plugin(IModel):
    """
    The Plugin(pytorchmodel) class specifies methods on
    handling methods in performing identifying, validating, predicting, scoring.
    """

    # Some information on plugin
    _model: Any = None
    _model_algorithm: str = ""
    _supported_algorithms: List = ["torch.nn.Sequential", "collections.OrderedDict", "torch.nn.modules.container.Sequential"]
    _name: str = "pytorchmodel"
    _description: str = "pytorchmodel supports detecting pytorch models"
    _version: str = "0.9.0"
    _metadata: PluginMetadata = PluginMetadata(_name, _description, _version)
    _plugin_type: PluginType = PluginType.MODEL
    _model_plugin_type: ModelPluginType = ModelPluginType.PYTORCH

    @staticmethod
    def get_metadata() -> PluginMetadata:
        """
        A method to return the metadata for this plugin

        Returns:
            PluginMetadata: Metadata of this plugin
        """
        return Plugin._metadata

    @staticmethod
    def get_plugin_type() -> PluginType:
        """
        A method to return the type for this plugin

        Returns:
             PluginType: Type of this plugin
        """
        return Plugin._plugin_type

    @staticmethod
    def get_model_plugin_type() -> ModelPluginType:
        """
        A method to return ModelPluginType

        Returns:
            ModelPluginType: Model Plugin Type
        """
        return Plugin._model_plugin_type

    def __init__(self, **kwargs) -> None:
        model = kwargs.get("model", None)
        if model:
            self._model = model

    def cleanup(self) -> None:
        """
        A method to clean-up objects
        """
        pass  # pragma: no cover

    def setup(self) -> Tuple[bool, str]:
        """
        A method to perform setup

        Returns:
            Tuple[bool, str]: Returns bool to indicate success, str will indicate the
            error message if failed.
        """
        print("performing setup...")
        is_success = True
        error_messages = ""
        return is_success, error_messages

    def get_model(self) -> Any:
        """
        A method to return the model

        Returns:
            Any: Model
        """
        if self._model:
            return self._model
        else:
            return None

    def get_model_algorithm(self) -> str:
        """
        A method to return the model algorithm.
        Either one of the supported algorithms or ""

        Returns:
            str: model algorithm name if supported or "" if not supported
        """
        return self._model_algorithm

    def is_supported(self) -> bool:
        """
        A method to check whether the model is being identified correctly
        and is supported

        Returns:
            bool: True if is an instance of model and is supported
        """
        is_algorithm_supported, model_algorithm = self._identify_model_algorithm(
            self._model
        )

        if is_algorithm_supported:
            self._model_algorithm = model_algorithm
        else:
            # Not supported
            pass

        return is_algorithm_supported

    def predict_latest(self, data: Any, *args) -> Any:
        print(f"data : {data}")
        data_tensor = torch.tensor(data, dtype=torch.float32)

        print(f"data_tensor : {data_tensor}")
        self._model.eval() 
        with torch.no_grad():  # Disable gradient calculation
            predictions = self._model(data_tensor)
            print(f"predictions {predictions}")
            return predictions
        
    def predict_working(self, data: Any, *args) -> Any:
        """
        A method to perform prediction using the model (classification)

        Args:
            data (Any): data to be predicted by the model

        Returns:
            Any: predicted result
        """
        print(f" == Evaluating pytorch model for prediction == ")

        try:
            # ===== working ========
            # data_tensor = torch.tensor(data.values, dtype=torch.float32)
            # torch.save(data_tensor, "data_samples.pth")

            # # # Load the saved tensors to verify they work with your model
            # loaded_data = torch.load("data_samples.pth")

            # # Set the model to evaluation mode
            # self._model.eval()
        
            # Ensure that predictions are made without gradient tracking
            # with torch.no_grad():
            #     # Check if data is a list
            #     if isinstance(loaded_data, list):
            #         predictions = []
            #         for item in loaded_data:
            #             input_tensor = torch.tensor(item).unsqueeze(0)  # Add batch dimension if necessary
            #             predictions.append(self._model(input_tensor).squeeze().numpy())
            #         return predictions
            #     else:
            #         # For single item prediction
            #         input_tensor = torch.tensor(loaded_data).unsqueeze(0)  # Add batch dimension if necessary
            #         return self._model(input_tensor).squeeze().numpy()

            # ========================

            # Convert data to a tensor; handle both lists and pandas DataFrames
            if isinstance(data, pd.DataFrame):
                data_tensor = torch.tensor(data.values, dtype=torch.float32)
            elif isinstance(data, list):
                data_tensor = torch.tensor(data, dtype=torch.float32)
            else:
                raise ValueError("Unsupported data format. Provide a list or pandas DataFrame.")

            # Save data tensor for debugging or reproducibility if necessary
            torch.save(data_tensor, "data_samples.pth")

            # Load the saved tensors to verify they work with your model
            loaded_data = torch.load("data_samples.pth")
            
            # Set the model to evaluation mode
            self._model.eval()
        
            # Ensure that predictions are made without gradient tracking
            with torch.no_grad():
                if len(loaded_data.shape) == 1:
                    # Single item prediction (no batch dimension)
                    input_tensor = loaded_data.unsqueeze(0)  # Add batch dimension if necessary
                    prediction = self._model(input_tensor).squeeze().numpy()
                    return prediction
                else:
                    # Batch prediction
                    predictions = self._model(loaded_data).numpy()
                    return predictions

        except Exception as e:
            print(f"Error during prediction: {e}")
            raise e


    def predict(self, data: Any, *args) -> Any:
        """
        A method to perform prediction using the model (classification)

        Args:
            data (Union[pd.DataFrame, list]): data to be predicted by the model

        Returns:
            Any: predicted result
        """
        print(f" == Evaluating PyTorch model for prediction == ")

        try:

            print(f"data : {data}")

            if isinstance(data, str):
                print("== Loading data from CSV file ==")
                data = pd.read_csv(data)
                data_tensor = torch.tensor(data.values, dtype=torch.float32)


            # Convert data to a tensor; handle both lists and pandas DataFrames
            elif isinstance(data, pd.DataFrame):
                print("== Data is a DataFrame ==")
                # Convert the list to a NumPy array

                data_np = np.array(data, dtype=np.float32)
                print(f"data_np : {data_np}")

                # Convert the NumPy array to a PyTorch tensor
                data_tensor = torch.tensor(data_np).squeeze(0)


                # If the data is in pandas DataFrame format, convert to numpy first
        
                # data_tensor = torch.tensor(data.values, dtype=torch.float32)
                # print(f"data_tensor DataFrame  : {data_tensor}")
        

                # data_tensor = torch.tensor(data.drop(columns=["target"]).values, dtype=torch.float32)
            #     data_np = data.to_numpy() 
            #     # data_tensor = torch.tensor(data.to_numpy(), dtype=torch.float32)  # Convert to numpy first
            #     data_tensor = torch.tensor(data.values, dtype=torch.float32)

            elif isinstance(data, list):
                print("== Loading data from list file ==")
                # Convert the list to a NumPy array
                data_list = np.array(data, dtype=np.float32)

                print(f"np array : {data_list}")


                # Convert the NumPy array to a PyTorch tensor
                data_tensor = torch.tensor(data_list, dtype=torch.float32).squeeze(0)

                print(f" data_tensor : {data_tensor}")

            else:
                raise ValueError("Unsupported data format. Provide a list or pandas DataFrame.")


            print(f"self._model {self._model}")
            torch.set_num_threads(1)

            # device = torch.device("cpu")
            # data_tensor = data_tensor.to(device)
            # self._model.to(device)
            
            print(f"pymodel : setting to eval")
            # self._model.load(torch.load("/Users/sureshjain/Desktop/pytorch/1_model.pth"))
            self._model.eval()
            

        
            # Ensure that predictions are made without gradient tracking
            with torch.no_grad():
                if len(data_tensor.shape) == 1:
                    print("predict if")
                    # Single item prediction (no batch dimension)
                    input_tensor = data_tensor.unsqueeze(0)  # Add batch dimension if necessary
                    prediction = self._model(input_tensor).squeeze().numpy()
                    print("Predicted probabilities:", predictions)
                    return prediction
                else:
                    # Batch prediction
                    print("predict else part ")
                    print(data_tensor.size())
                    print(f"dtype : {data_tensor.dtype}")
                    print("===========")
                    
                    print("===========")

                    # input_size = 5  # Number of features in your tabular data
                    # hidden_size = 10
                    # output_size = 3  # Number of classes for classification

                    # Create the model using torch.nn.Sequential
                    # model = nn.Sequential(
                    #     nn.Linear(input_size, hidden_size),
                    #     nn.ReLU(),
                    #     nn.Linear(hidden_size, output_size),
                    #     nn.Softmax(dim=1)  # Softmax for classification probabilities
                    # )

                    # data_tensor = torch.tensor([[0.5488, 0.7152, 0.6028, 0.5449, 0.4237],
                    #     [0.6459, 0.4376, 0.8918, 0.9637, 0.3834],
                    #     [0.7917, 0.5289, 0.5680, 0.9256, 0.0710],
                    #     [0.0871, 0.0202, 0.8326, 0.7782, 0.8700],
                    #     [0.9786, 0.7992, 0.4615, 0.7805, 0.1183],
                    #     [0.6399, 0.1434, 0.9447, 0.5218, 0.4147],
                    #     [0.2646, 0.7742, 0.4562, 0.5684, 0.0188],
                    #     [0.6176, 0.6121, 0.6169, 0.9437, 0.6818],
                    #     [0.3595, 0.4370, 0.6976, 0.0602, 0.6668],
                    #     [0.6706, 0.2104, 0.1289, 0.3154, 0.3637]])
                    # data_tensor = data_tensor.to(device)

                    # torch.set_num_threads(1)
                    predictions = self._model(data_tensor)
                    print(f"predictions : {predictions}")

                    predictions = predictions.numpy()
                    print("Predicted np :", predictions)
                    return predictions

        except Exception as e:
            print(f"Error during prediction: {e}")
            raise e
        
    def predict_proba_original(self, data: Any, *args) -> Any:
        """
        A method to perform prediction probability using the model

        Args:
            data (Any): data to be predicted by the model

        Returns:
            Any: predicted result
        """
        try:
            return self._model.predict_proba(data)
        except Exception:
            raise
    
    def predict_proba(self, data: Any, *args) -> Any:
        """
        A method to perform prediction probability using the model.

        Args:
            data (Any): data to be predicted by the model

        Returns:
            Any: predicted result probabilities
        """
        try:
            # Set the model to evaluation mode
            self._model.eval()
            
            with torch.no_grad():
                # Check if data is a list
                if isinstance(data, list):
                        probabilities = []
                        for item in data:
                            input_tensor = torch.tensor(item).unsqueeze(0)  # Add batch dimension if necessary
                            logits = self._model(input_tensor)
                            probas = softmax(logits, dim=1).squeeze().numpy()
                            probabilities.append(probas)
                        return probabilities
                else:
                    # For single item prediction
                    input_tensor = torch.tensor(data).unsqueeze(0)  # Add batch dimension if necessary
                    logits = self._model(input_tensor)
                    return softmax(logits, dim=1).squeeze().numpy()

        except Exception as e:
            raise e

    def score(self, data: Any, y_true: Any) -> Any:
        """
        A method to perform scoring using the model

        Args:
            data (Any): data to be scored with y_true
            y_true (Any): ground truth

        Returns:
            Any: score result
        """
        raise NotImplementedError

    def _identify_model_algorithm(self, model: Any) -> Tuple[bool, str]:
        """
        A helper method to identify the model algorithm whether it is being supported

        Args:
            model (Any): the model to be checked against the supported model list

        Returns:
            Tuple[bool, str]: true if model is supported, str will store the support
            algo name
        """
        model_algorithm = ""
        is_success = False

        module_type_name = f"{type(model).__module__}.{type(model).__name__}"
        
        for supported_algo in self._supported_algorithms:
            print(f"pytorchmodel: module_type_name : {module_type_name} {supported_algo}")
            if supported_algo == module_type_name:
                model_algorithm = supported_algo
                is_success = True

        return is_success, model_algorithm
    

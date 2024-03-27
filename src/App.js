import "./App.css";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import useData from "./hooks/useData";

function App() {
  const { getData, inventoryData } = useData();
  const [totalValue, setTotalValue] = useState();
  const [categoryCount, setCategoryCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newProductList, setNewProductList] = useState([]);
  const [newProductData, setNewProductData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemsWithZeroQuantity, setItemsWithZeroQuantity] = useState([]);

  const handleToggle = () => {
    setIsAdmin(!isAdmin);
  };
  const handleDelete = (itemName) => {
    const updatedProductList = newProductList.filter(
      (item) => item.name !== itemName
    );
    setNewProductList(updatedProductList);
    setNewProductData(updatedProductList);
  };
  const handleDisable = (itemName) => {
    const updatedDataArray = newProductList.map((item) => {
      if (item.name === itemName) {
        return {
          ...item,
          disable: !item.disable,
        };
      }
      return item;
    });

    setNewProductData(updatedDataArray);
    setNewProductList(updatedDataArray);
  };

  useEffect(() => {
    const newArray = newProductList?.filter((item) => !item.disable);
    setNewProductData(newArray);
  }, [newProductList]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const zeroQuantityItems = newProductData.filter(
      (item) => item.quantity === "0" || item.quantity === 0
    );
    setItemsWithZeroQuantity(zeroQuantityItems);
  }, [newProductData]);

  useEffect(() => {
    if (inventoryData) {
      setNewProductList(inventoryData);
      setNewProductData(inventoryData);
    }
  }, [inventoryData]);

  useEffect(() => {
    let sum = 0;
    newProductData.forEach((item) => {
      sum += parseFloat(item.value.replace("$", ""));
    });
    setTotalValue(sum);
    const categories = newProductData.map((item) => item.category);
    const uniqueCategories = [...new Set(categories)];
    setCategoryCount(uniqueCategories.length);
  }, [newProductData]);

  const handleEditClick = (item) => {
    setEditItem(item);
    setOpenDialog(true);
  };

  function updatePropertyByName(name, property, newValue) {
    return newProductList.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          [property]: newValue,
        };
      }
      return item;
    });
  }
  const handleUpdate = (name, property, newValue) => {
    const updatedDataArray = updatePropertyByName(name, property, newValue);
    setNewProductList(updatedDataArray);
  };

  const handleSaveChanges = () => {
    setNewProductData(newProductList);
    setOpenDialog(false);
    setEditItem(null);
  };

  return (
    <div>
      <div>
        <p>Switch to {!isAdmin ? "Admin" : "User"}</p>
        <Switch
          checked={isAdmin}
          onChange={handleToggle}
          color="primary"
          name="isAdminSwitch"
          inputProps={{ "aria-label": "isAdmin switch" }}
        />
      </div>

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total product
              </Typography>
              <Typography variant="body2">{newProductData?.length}</Typography>
            </CardContent>
          </Card>
        </Grid>{" "}
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total store value{" "}
              </Typography>
              <Typography variant="body2">${totalValue}</Typography>
            </CardContent>
          </Card>
        </Grid>{" "}
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Out of stocks
              </Typography>
              <Typography variant="body2">
                {itemsWithZeroQuantity?.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>{" "}
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                No. of category
              </Typography>
              <Typography variant="body2">{categoryCount}</Typography>
            </CardContent>
          </Card>
        </Grid>{" "}
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newProductList.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>
                  <IconButton
                    disabled={!isAdmin || row.disable}
                    aria-label="edit"
                    onClick={() => handleEditClick(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={!isAdmin}
                    aria-label="disable"
                    onClick={() => handleDisable(row.name)}
                  >
                    <BlockIcon style={{ color: row?.disable ? "red" : "" }} />
                  </IconButton>
                  <IconButton
                    disabled={!isAdmin}
                    aria-label="delete"
                    onClick={() => handleDelete(row.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Category"
            value={
              newProductList.find((item) => item.name === editItem?.name)
                ?.category
            }
            fullWidth
            onChange={(e) =>
              isAdmin &&
              handleUpdate(editItem?.name, "category", e.target.value)
            }
          />
          <TextField
            label="Price"
            value={
              newProductList.find((item) => item.name === editItem?.name)?.price
            }
            fullWidth
            onChange={(e) =>
              isAdmin && handleUpdate(editItem?.name, "price", e.target.value)
            }
          />
          <TextField
            label="Quantity"
            value={
              newProductList.find((item) => item.name === editItem?.name)
                ?.quantity
            }
            fullWidth
            onChange={(e) =>
              isAdmin &&
              handleUpdate(editItem?.name, "quantity", e.target.value)
            }
          />
          <TextField
            label="Value"
            value={
              newProductList.find((item) => item.name === editItem?.name)?.value
            }
            fullWidth
            onChange={(e) =>
              isAdmin && handleUpdate(editItem?.name, "value", e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;

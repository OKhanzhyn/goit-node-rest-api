import Contact from "../models/contact.js";
async function listContacts() {
  try {
    const data = await Contact.find();
    return data;
  } catch (error) {
    next(error);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await Contact.findByIdAndDelete(contactId);
    return data;
  } catch (error) {
    next(error);
  }
}

async function addContact(name, email, phone, favorite = false) {
  const newBook = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
  };

  try {
    const data = await Contact.create(newBook);

    return data;
  } catch (error) {
    next(error);
  }
}

async function updateContact(contactId, favorite, name, email, phone) {
  const currentContact = await Contact.findById(contactId);
  if (currentContact == null) {
    return null;
  }
  const newData = {
    name: name !== undefined ? name : currentContact.name,
    email: email !== undefined ? email : currentContact.email,
    phone: phone !== undefined ? phone : currentContact.phone,
    favorite: favorite !== undefined ? favorite : currentContact.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(contactId, newData, {
      new: true,
    });
    console.log(result);
    return result;
  } catch (error) {
    next(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
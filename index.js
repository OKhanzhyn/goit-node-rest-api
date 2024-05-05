import { program } from "commander";
import Contacts from "./contacts.js";

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
        try {
      const contacts = await Contacts.listContacts();
      console.table(contacts);
        } catch (error) {
            console.error(error);
        }
      break;

    case "get":
        try {
      const contact = await Contacts.getContactById(id);
      console.log(contact);
     } catch (error) {
        console.error(error);
     }
      break;

    case "add":
        try {
      const addContact = await Contacts.addContact( name, email, phone );
      console.log(addContact); 
    } catch (error) {
        console.error(error);
    }
        break;

    case "remove":
        try {
      const removeContact = await Contacts.removeContact(id); 
      console.log(removeContact);        
    } catch (error) {
        console.error(error);
    }
        break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(options);
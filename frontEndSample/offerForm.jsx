import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./common/form";
import { getOffer, saveOffer } from "../services/offerService";
import { getUser } from "../services/userService";

class OfferForm extends Form {
    state = {
        data: {
            displayname: "",
            sendingFrom: "",
            sendingTo: "",
            amount: "",
            exchangeType: "",
            status: "",
            userId: "",
        },
        statusChoices: ["AVAILABLE", "COMPLETED"],
        user: [],
        errors: {},
    };

    // validating offer model
    schema = {
        _id: Joi.string(),
        displayname: Joi.string()
            .required()
            .min(3)
            .max(255)
            .label("Displayed Name"), 
        sendingFrom: Joi.string()
            .required()
            .min(3)
            .max(255)
            .label("Sending From"),
        sendingTo: Joi.string().required().min(3).max(255).label("Sending To"),
        amount: Joi.number().required().min(100).max(1000000).label("Amount"),
        exchangeType: Joi.string()
            .required()
            .min(3)
            .max(255)
            .label("Money Exchange Method"),
        status: Joi.string().required().label("Offer Status"),
        userId: Joi.string(),
    };

    // TODO: check if this is right way, move it to another module. used in offersTable as well

    async populateOffer() {
        try {
            const offerId = this.props.match.params.id;
            const { data: user } = await getUser();
            if (offerId === "new") {
                const clonedData = { ...this.state.data };
                clonedData.userId = user._id;
                this.setState({ data: clonedData });
                return;
            }

            const { data: offer } = await getOffer(offerId);

            if (offer.userId === user._id || user.isAdmin) {
                // if you are admin or owner of the offer you can see edit page
                this.setState({ data: this.mapToViewModel(offer) });
            } else {
                toast.error("You can edit only your offers");
                this.props.history.push("/");

            }
        } catch (ex) {
            if (ex.response && ex.response.status === 404)
                this.props.history.replace("/not-found");
        }
    }

    async componentDidMount() {
        await this.populateOffer();
        console.log(this.state.statusChoices);
    }

    mapToViewModel(offer) {
        return {
            _id: offer._id,
            displayname: offer.displayname,
            sendingFrom: offer.sendingFrom,
            sendingTo: offer.sendingTo,
            amount: offer.amount,
            exchangeType: offer.exchangeType,
            status: offer.status,
            userId: offer.userId,
        };
    }

    // sending data to backend
    doSubmit = async () => {
        await saveOffer(this.state.data);
        this.props.history.push("/offers");
    };

    render() {
        return (
            <div>
                <h1>POST YOUR OFFER</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("displayname", "Name to be displayed")}
                    {this.renderInput(
                        "sendingFrom",
                        "Where are you sending your money from?"
                    )}
                    {this.renderInput(
                        "sendingTo",
                        "Where are you sending your money to?"
                    )}
                    {this.renderInput(
                        "amount",
                        "How much are you sending (in USD)?"
                    )}
                    {this.renderInput(
                        "exchangeType",
                        "Preferred money exchange method. Ex: Zelle, Cash delivery"
                    )}
                    {this.renderSelect(
                        "status",
                        "What is the status of this offer?",
                        this.state.statusChoices
                    )}
                    {this.renderButton("Save")}
                </form>
            </div>
        );
    }
}

export default OfferForm;

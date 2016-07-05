import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerUser} from '../../actions/firebase_actions';

class UserRegister extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            message: ''
        }

    }

    onFormSubmit(event) {
        event.preventDefault();
        let bizName = this.refs.bizName.value;
        let firstName = this.refs.firstName.value;
        let lastName = this.refs.lastName.value;
        let phoneNumber = this.refs.phoneNumber.value;
        let email = this.refs.email.value;
        let password = this.refs.password.value;
        this.props.registerUser({email: email, password: password, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, bizName: bizName}).then(data => {

            if (data.payload.errorCode)
                this.setState({message: data.payload.errorMessage});
            else
                browserHistory.push('/profile');

            }
        )

    }

    render() {
        return (
            <div className="col-md-4">
                <form id="frmRegister" role="form" onSubmit={this.onFormSubmit}>
                    <p>{this.state.message}</p>
                    <h2>Become a Member!</h2>
                      <div className="form-group">
                            <label>Business Name</label>
                            <input type="text" className="form-control" ref="bizName" id="bizName" placeholder="Enter your business's name" name="bizName"/>
                      </div>
                    <div className="form-group">
                          <label>First Name</label>
                          <input type="text" className="form-control" ref="firstName" id="firstName" placeholder="Enter first name" name="firstName"/>
                    </div>
                    <div className="form-group">
                          <label>Last Name</label>
                          <input type="text" className="form-control" ref="lastName" id="lastName" placeholder="Enter last name" name="lastName"/>
                    </div>
                    <div className="form-group">
                          <label>Phone Number</label>
                          <input type="tel" className="form-control" ref="phoneNumber" id="phoneNumber" placeholder="Enter contact number" name="phoneNumber"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtRegEmail">Email address</label>
                        <input type="email" className="form-control" ref="email" id="txtEmail" placeholder="Enter email" name="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtRegPass">Password</label>
                        <input type="password" className="form-control" ref="password" id="txtPass" placeholder="Password" name="password"/>
                    </div>
                    <button type="submit" className="btn btn-default">Enroll in CurbSpot!</button>
                </form>
            </div>
        )
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        registerUser
    }, dispatch);
}

function mapStateToProps(state) {
    return {currentUser: state.currentUser};

}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);

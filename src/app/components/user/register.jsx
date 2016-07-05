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

    onFormSubmit(e) {
        e.preventDefault();
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
                    <h6>*All fields required</h6>
                      <div className="form-group">
                            <label>Business Name</label>
                            <input type="text" className="form-control" ref="bizName" id="bizName" placeholder="Enter your business's name" name="bizName" required/>
                      </div>
                    <div className="form-group">
                          <label>First Name</label>
                          <input type="text" className="form-control" ref="firstName" id="firstName" placeholder="Enter first name" name="firstName" required/>
                    </div>
                    <div className="form-group">
                          <label>Last Name</label>
                          <input type="text" className="form-control" ref="lastName" id="lastName" placeholder="Enter last name" name="lastName" required/>
                    </div>
                    <div className="form-group">
                          <label>Phone Number <em>(ex. 123-456-7890)</em></label>
                          <input type="tel" className="form-control" ref="phoneNumber" id="phoneNumber" placeholder="Enter contact number" name="phoneNumber" pattern="^\d{3}-\d{3}-\d{4}$" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtRegEmail">Email address</label>
                        <input type="email" className="form-control" ref="email" id="txtEmail" placeholder="Enter email" name="email" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtRegPass">Password</label>
                        <input type="password" className="form-control" ref="password" id="txtPass" placeholder="Password" name="password" required/>
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

from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, SelectField
from wtforms.fields.simple import PasswordField
from wtforms.validators import DataRequired, Optional


class LoginForm(FlaskForm):
    firstname = StringField('Username', validators=[DataRequired()])
    lastname = StringField('Lastname', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class PreferenceForm(FlaskForm):
    location_details = StringField('Location Details', validators=[Optional()])
    subject = StringField('Subject', validators=[DataRequired()])
    availability = StringField('Availability', validators=[DataRequired()])
    location_type = SelectField('Location Type', choices=[('online', 'Online'), ('offline', 'Offline')], validators=[DataRequired()])
    submit = SubmitField('Save Preferences')
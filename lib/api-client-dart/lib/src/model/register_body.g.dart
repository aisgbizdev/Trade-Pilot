// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const RegisterBodySelectedModeEnum _$registerBodySelectedModeEnum_beginner =
    const RegisterBodySelectedModeEnum._('beginner');
const RegisterBodySelectedModeEnum _$registerBodySelectedModeEnum_pro =
    const RegisterBodySelectedModeEnum._('pro');

RegisterBodySelectedModeEnum _$registerBodySelectedModeEnumValueOf(
    String name) {
  switch (name) {
    case 'beginner':
      return _$registerBodySelectedModeEnum_beginner;
    case 'pro':
      return _$registerBodySelectedModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<RegisterBodySelectedModeEnum>
    _$registerBodySelectedModeEnumValues =
    BuiltSet<RegisterBodySelectedModeEnum>(const <RegisterBodySelectedModeEnum>[
  _$registerBodySelectedModeEnum_beginner,
  _$registerBodySelectedModeEnum_pro,
]);

Serializer<RegisterBodySelectedModeEnum>
    _$registerBodySelectedModeEnumSerializer =
    _$RegisterBodySelectedModeEnumSerializer();

class _$RegisterBodySelectedModeEnumSerializer
    implements PrimitiveSerializer<RegisterBodySelectedModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[RegisterBodySelectedModeEnum];
  @override
  final String wireName = 'RegisterBodySelectedModeEnum';

  @override
  Object serialize(Serializers serializers, RegisterBodySelectedModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  RegisterBodySelectedModeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      RegisterBodySelectedModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$RegisterBody extends RegisterBody {
  @override
  final String email;
  @override
  final String password;
  @override
  final String displayName;
  @override
  final RegisterBodySelectedModeEnum? selectedMode;
  @override
  final String securityQuestion;
  @override
  final String securityAnswer;
  @override
  final bool? rememberMe;

  factory _$RegisterBody([void Function(RegisterBodyBuilder)? updates]) =>
      (RegisterBodyBuilder()..update(updates))._build();

  _$RegisterBody._(
      {required this.email,
      required this.password,
      required this.displayName,
      this.selectedMode,
      required this.securityQuestion,
      required this.securityAnswer,
      this.rememberMe})
      : super._();
  @override
  RegisterBody rebuild(void Function(RegisterBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RegisterBodyBuilder toBuilder() => RegisterBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RegisterBody &&
        email == other.email &&
        password == other.password &&
        displayName == other.displayName &&
        selectedMode == other.selectedMode &&
        securityQuestion == other.securityQuestion &&
        securityAnswer == other.securityAnswer &&
        rememberMe == other.rememberMe;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, password.hashCode);
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, selectedMode.hashCode);
    _$hash = $jc(_$hash, securityQuestion.hashCode);
    _$hash = $jc(_$hash, securityAnswer.hashCode);
    _$hash = $jc(_$hash, rememberMe.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RegisterBody')
          ..add('email', email)
          ..add('password', password)
          ..add('displayName', displayName)
          ..add('selectedMode', selectedMode)
          ..add('securityQuestion', securityQuestion)
          ..add('securityAnswer', securityAnswer)
          ..add('rememberMe', rememberMe))
        .toString();
  }
}

class RegisterBodyBuilder
    implements Builder<RegisterBody, RegisterBodyBuilder> {
  _$RegisterBody? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _password;
  String? get password => _$this._password;
  set password(String? password) => _$this._password = password;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  RegisterBodySelectedModeEnum? _selectedMode;
  RegisterBodySelectedModeEnum? get selectedMode => _$this._selectedMode;
  set selectedMode(RegisterBodySelectedModeEnum? selectedMode) =>
      _$this._selectedMode = selectedMode;

  String? _securityQuestion;
  String? get securityQuestion => _$this._securityQuestion;
  set securityQuestion(String? securityQuestion) =>
      _$this._securityQuestion = securityQuestion;

  String? _securityAnswer;
  String? get securityAnswer => _$this._securityAnswer;
  set securityAnswer(String? securityAnswer) =>
      _$this._securityAnswer = securityAnswer;

  bool? _rememberMe;
  bool? get rememberMe => _$this._rememberMe;
  set rememberMe(bool? rememberMe) => _$this._rememberMe = rememberMe;

  RegisterBodyBuilder() {
    RegisterBody._defaults(this);
  }

  RegisterBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _password = $v.password;
      _displayName = $v.displayName;
      _selectedMode = $v.selectedMode;
      _securityQuestion = $v.securityQuestion;
      _securityAnswer = $v.securityAnswer;
      _rememberMe = $v.rememberMe;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RegisterBody other) {
    _$v = other as _$RegisterBody;
  }

  @override
  void update(void Function(RegisterBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RegisterBody build() => _build();

  _$RegisterBody _build() {
    final _$result = _$v ??
        _$RegisterBody._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'RegisterBody', 'email'),
          password: BuiltValueNullFieldError.checkNotNull(
              password, r'RegisterBody', 'password'),
          displayName: BuiltValueNullFieldError.checkNotNull(
              displayName, r'RegisterBody', 'displayName'),
          selectedMode: selectedMode,
          securityQuestion: BuiltValueNullFieldError.checkNotNull(
              securityQuestion, r'RegisterBody', 'securityQuestion'),
          securityAnswer: BuiltValueNullFieldError.checkNotNull(
              securityAnswer, r'RegisterBody', 'securityAnswer'),
          rememberMe: rememberMe,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

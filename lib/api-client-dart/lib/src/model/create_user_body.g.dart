// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_user_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateUserBodyRoleEnum _$createUserBodyRoleEnum_user =
    const CreateUserBodyRoleEnum._('user');
const CreateUserBodyRoleEnum _$createUserBodyRoleEnum_admin =
    const CreateUserBodyRoleEnum._('admin');
const CreateUserBodyRoleEnum _$createUserBodyRoleEnum_superAdmin =
    const CreateUserBodyRoleEnum._('superAdmin');

CreateUserBodyRoleEnum _$createUserBodyRoleEnumValueOf(String name) {
  switch (name) {
    case 'user':
      return _$createUserBodyRoleEnum_user;
    case 'admin':
      return _$createUserBodyRoleEnum_admin;
    case 'superAdmin':
      return _$createUserBodyRoleEnum_superAdmin;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateUserBodyRoleEnum> _$createUserBodyRoleEnumValues =
    BuiltSet<CreateUserBodyRoleEnum>(const <CreateUserBodyRoleEnum>[
  _$createUserBodyRoleEnum_user,
  _$createUserBodyRoleEnum_admin,
  _$createUserBodyRoleEnum_superAdmin,
]);

Serializer<CreateUserBodyRoleEnum> _$createUserBodyRoleEnumSerializer =
    _$CreateUserBodyRoleEnumSerializer();

class _$CreateUserBodyRoleEnumSerializer
    implements PrimitiveSerializer<CreateUserBodyRoleEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'user': 'user',
    'admin': 'admin',
    'superAdmin': 'super_admin',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'user': 'user',
    'admin': 'admin',
    'super_admin': 'superAdmin',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateUserBodyRoleEnum];
  @override
  final String wireName = 'CreateUserBodyRoleEnum';

  @override
  Object serialize(Serializers serializers, CreateUserBodyRoleEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateUserBodyRoleEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateUserBodyRoleEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateUserBody extends CreateUserBody {
  @override
  final String email;
  @override
  final String password;
  @override
  final String displayName;
  @override
  final CreateUserBodyRoleEnum? role;
  @override
  final String? securityQuestion;
  @override
  final String? securityAnswer;

  factory _$CreateUserBody([void Function(CreateUserBodyBuilder)? updates]) =>
      (CreateUserBodyBuilder()..update(updates))._build();

  _$CreateUserBody._(
      {required this.email,
      required this.password,
      required this.displayName,
      this.role,
      this.securityQuestion,
      this.securityAnswer})
      : super._();
  @override
  CreateUserBody rebuild(void Function(CreateUserBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateUserBodyBuilder toBuilder() => CreateUserBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateUserBody &&
        email == other.email &&
        password == other.password &&
        displayName == other.displayName &&
        role == other.role &&
        securityQuestion == other.securityQuestion &&
        securityAnswer == other.securityAnswer;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, password.hashCode);
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jc(_$hash, securityQuestion.hashCode);
    _$hash = $jc(_$hash, securityAnswer.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateUserBody')
          ..add('email', email)
          ..add('password', password)
          ..add('displayName', displayName)
          ..add('role', role)
          ..add('securityQuestion', securityQuestion)
          ..add('securityAnswer', securityAnswer))
        .toString();
  }
}

class CreateUserBodyBuilder
    implements Builder<CreateUserBody, CreateUserBodyBuilder> {
  _$CreateUserBody? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _password;
  String? get password => _$this._password;
  set password(String? password) => _$this._password = password;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  CreateUserBodyRoleEnum? _role;
  CreateUserBodyRoleEnum? get role => _$this._role;
  set role(CreateUserBodyRoleEnum? role) => _$this._role = role;

  String? _securityQuestion;
  String? get securityQuestion => _$this._securityQuestion;
  set securityQuestion(String? securityQuestion) =>
      _$this._securityQuestion = securityQuestion;

  String? _securityAnswer;
  String? get securityAnswer => _$this._securityAnswer;
  set securityAnswer(String? securityAnswer) =>
      _$this._securityAnswer = securityAnswer;

  CreateUserBodyBuilder() {
    CreateUserBody._defaults(this);
  }

  CreateUserBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _password = $v.password;
      _displayName = $v.displayName;
      _role = $v.role;
      _securityQuestion = $v.securityQuestion;
      _securityAnswer = $v.securityAnswer;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateUserBody other) {
    _$v = other as _$CreateUserBody;
  }

  @override
  void update(void Function(CreateUserBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateUserBody build() => _build();

  _$CreateUserBody _build() {
    final _$result = _$v ??
        _$CreateUserBody._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'CreateUserBody', 'email'),
          password: BuiltValueNullFieldError.checkNotNull(
              password, r'CreateUserBody', 'password'),
          displayName: BuiltValueNullFieldError.checkNotNull(
              displayName, r'CreateUserBody', 'displayName'),
          role: role,
          securityQuestion: securityQuestion,
          securityAnswer: securityAnswer,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

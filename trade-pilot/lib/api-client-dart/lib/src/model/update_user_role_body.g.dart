// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_user_role_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateUserRoleBodyRoleEnum _$updateUserRoleBodyRoleEnum_user =
    const UpdateUserRoleBodyRoleEnum._('user');
const UpdateUserRoleBodyRoleEnum _$updateUserRoleBodyRoleEnum_admin =
    const UpdateUserRoleBodyRoleEnum._('admin');
const UpdateUserRoleBodyRoleEnum _$updateUserRoleBodyRoleEnum_superAdmin =
    const UpdateUserRoleBodyRoleEnum._('superAdmin');

UpdateUserRoleBodyRoleEnum _$updateUserRoleBodyRoleEnumValueOf(String name) {
  switch (name) {
    case 'user':
      return _$updateUserRoleBodyRoleEnum_user;
    case 'admin':
      return _$updateUserRoleBodyRoleEnum_admin;
    case 'superAdmin':
      return _$updateUserRoleBodyRoleEnum_superAdmin;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateUserRoleBodyRoleEnum> _$updateUserRoleBodyRoleEnumValues =
    BuiltSet<UpdateUserRoleBodyRoleEnum>(const <UpdateUserRoleBodyRoleEnum>[
  _$updateUserRoleBodyRoleEnum_user,
  _$updateUserRoleBodyRoleEnum_admin,
  _$updateUserRoleBodyRoleEnum_superAdmin,
]);

Serializer<UpdateUserRoleBodyRoleEnum> _$updateUserRoleBodyRoleEnumSerializer =
    _$UpdateUserRoleBodyRoleEnumSerializer();

class _$UpdateUserRoleBodyRoleEnumSerializer
    implements PrimitiveSerializer<UpdateUserRoleBodyRoleEnum> {
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
  final Iterable<Type> types = const <Type>[UpdateUserRoleBodyRoleEnum];
  @override
  final String wireName = 'UpdateUserRoleBodyRoleEnum';

  @override
  Object serialize(Serializers serializers, UpdateUserRoleBodyRoleEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateUserRoleBodyRoleEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateUserRoleBodyRoleEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateUserRoleBody extends UpdateUserRoleBody {
  @override
  final UpdateUserRoleBodyRoleEnum role;

  factory _$UpdateUserRoleBody(
          [void Function(UpdateUserRoleBodyBuilder)? updates]) =>
      (UpdateUserRoleBodyBuilder()..update(updates))._build();

  _$UpdateUserRoleBody._({required this.role}) : super._();
  @override
  UpdateUserRoleBody rebuild(
          void Function(UpdateUserRoleBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateUserRoleBodyBuilder toBuilder() =>
      UpdateUserRoleBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateUserRoleBody && role == other.role;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateUserRoleBody')
          ..add('role', role))
        .toString();
  }
}

class UpdateUserRoleBodyBuilder
    implements Builder<UpdateUserRoleBody, UpdateUserRoleBodyBuilder> {
  _$UpdateUserRoleBody? _$v;

  UpdateUserRoleBodyRoleEnum? _role;
  UpdateUserRoleBodyRoleEnum? get role => _$this._role;
  set role(UpdateUserRoleBodyRoleEnum? role) => _$this._role = role;

  UpdateUserRoleBodyBuilder() {
    UpdateUserRoleBody._defaults(this);
  }

  UpdateUserRoleBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _role = $v.role;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateUserRoleBody other) {
    _$v = other as _$UpdateUserRoleBody;
  }

  @override
  void update(void Function(UpdateUserRoleBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateUserRoleBody build() => _build();

  _$UpdateUserRoleBody _build() {
    final _$result = _$v ??
        _$UpdateUserRoleBody._(
          role: BuiltValueNullFieldError.checkNotNull(
              role, r'UpdateUserRoleBody', 'role'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

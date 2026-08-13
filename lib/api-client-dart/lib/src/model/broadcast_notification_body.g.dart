// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'broadcast_notification_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const BroadcastNotificationBodyTypeEnum
    _$broadcastNotificationBodyTypeEnum_info =
    const BroadcastNotificationBodyTypeEnum._('info');
const BroadcastNotificationBodyTypeEnum
    _$broadcastNotificationBodyTypeEnum_warning =
    const BroadcastNotificationBodyTypeEnum._('warning');
const BroadcastNotificationBodyTypeEnum
    _$broadcastNotificationBodyTypeEnum_error =
    const BroadcastNotificationBodyTypeEnum._('error');

BroadcastNotificationBodyTypeEnum _$broadcastNotificationBodyTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'info':
      return _$broadcastNotificationBodyTypeEnum_info;
    case 'warning':
      return _$broadcastNotificationBodyTypeEnum_warning;
    case 'error':
      return _$broadcastNotificationBodyTypeEnum_error;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<BroadcastNotificationBodyTypeEnum>
    _$broadcastNotificationBodyTypeEnumValues = BuiltSet<
        BroadcastNotificationBodyTypeEnum>(const <BroadcastNotificationBodyTypeEnum>[
  _$broadcastNotificationBodyTypeEnum_info,
  _$broadcastNotificationBodyTypeEnum_warning,
  _$broadcastNotificationBodyTypeEnum_error,
]);

const BroadcastNotificationBodyAudienceTypeEnum
    _$broadcastNotificationBodyAudienceTypeEnum_all =
    const BroadcastNotificationBodyAudienceTypeEnum._('all');
const BroadcastNotificationBodyAudienceTypeEnum
    _$broadcastNotificationBodyAudienceTypeEnum_role =
    const BroadcastNotificationBodyAudienceTypeEnum._('role');
const BroadcastNotificationBodyAudienceTypeEnum
    _$broadcastNotificationBodyAudienceTypeEnum_tag =
    const BroadcastNotificationBodyAudienceTypeEnum._('tag');

BroadcastNotificationBodyAudienceTypeEnum
    _$broadcastNotificationBodyAudienceTypeEnumValueOf(String name) {
  switch (name) {
    case 'all':
      return _$broadcastNotificationBodyAudienceTypeEnum_all;
    case 'role':
      return _$broadcastNotificationBodyAudienceTypeEnum_role;
    case 'tag':
      return _$broadcastNotificationBodyAudienceTypeEnum_tag;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<BroadcastNotificationBodyAudienceTypeEnum>
    _$broadcastNotificationBodyAudienceTypeEnumValues = BuiltSet<
        BroadcastNotificationBodyAudienceTypeEnum>(const <BroadcastNotificationBodyAudienceTypeEnum>[
  _$broadcastNotificationBodyAudienceTypeEnum_all,
  _$broadcastNotificationBodyAudienceTypeEnum_role,
  _$broadcastNotificationBodyAudienceTypeEnum_tag,
]);

const BroadcastNotificationBodyTargetRoleEnum
    _$broadcastNotificationBodyTargetRoleEnum_user =
    const BroadcastNotificationBodyTargetRoleEnum._('user');
const BroadcastNotificationBodyTargetRoleEnum
    _$broadcastNotificationBodyTargetRoleEnum_admin =
    const BroadcastNotificationBodyTargetRoleEnum._('admin');
const BroadcastNotificationBodyTargetRoleEnum
    _$broadcastNotificationBodyTargetRoleEnum_superAdmin =
    const BroadcastNotificationBodyTargetRoleEnum._('superAdmin');

BroadcastNotificationBodyTargetRoleEnum
    _$broadcastNotificationBodyTargetRoleEnumValueOf(String name) {
  switch (name) {
    case 'user':
      return _$broadcastNotificationBodyTargetRoleEnum_user;
    case 'admin':
      return _$broadcastNotificationBodyTargetRoleEnum_admin;
    case 'superAdmin':
      return _$broadcastNotificationBodyTargetRoleEnum_superAdmin;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<BroadcastNotificationBodyTargetRoleEnum>
    _$broadcastNotificationBodyTargetRoleEnumValues = BuiltSet<
        BroadcastNotificationBodyTargetRoleEnum>(const <BroadcastNotificationBodyTargetRoleEnum>[
  _$broadcastNotificationBodyTargetRoleEnum_user,
  _$broadcastNotificationBodyTargetRoleEnum_admin,
  _$broadcastNotificationBodyTargetRoleEnum_superAdmin,
]);

Serializer<BroadcastNotificationBodyTypeEnum>
    _$broadcastNotificationBodyTypeEnumSerializer =
    _$BroadcastNotificationBodyTypeEnumSerializer();
Serializer<BroadcastNotificationBodyAudienceTypeEnum>
    _$broadcastNotificationBodyAudienceTypeEnumSerializer =
    _$BroadcastNotificationBodyAudienceTypeEnumSerializer();
Serializer<BroadcastNotificationBodyTargetRoleEnum>
    _$broadcastNotificationBodyTargetRoleEnumSerializer =
    _$BroadcastNotificationBodyTargetRoleEnumSerializer();

class _$BroadcastNotificationBodyTypeEnumSerializer
    implements PrimitiveSerializer<BroadcastNotificationBodyTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
  };

  @override
  final Iterable<Type> types = const <Type>[BroadcastNotificationBodyTypeEnum];
  @override
  final String wireName = 'BroadcastNotificationBodyTypeEnum';

  @override
  Object serialize(
          Serializers serializers, BroadcastNotificationBodyTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  BroadcastNotificationBodyTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      BroadcastNotificationBodyTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$BroadcastNotificationBodyAudienceTypeEnumSerializer
    implements PrimitiveSerializer<BroadcastNotificationBodyAudienceTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'all': 'all',
    'role': 'role',
    'tag': 'tag',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'all': 'all',
    'role': 'role',
    'tag': 'tag',
  };

  @override
  final Iterable<Type> types = const <Type>[
    BroadcastNotificationBodyAudienceTypeEnum
  ];
  @override
  final String wireName = 'BroadcastNotificationBodyAudienceTypeEnum';

  @override
  Object serialize(Serializers serializers,
          BroadcastNotificationBodyAudienceTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  BroadcastNotificationBodyAudienceTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      BroadcastNotificationBodyAudienceTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$BroadcastNotificationBodyTargetRoleEnumSerializer
    implements PrimitiveSerializer<BroadcastNotificationBodyTargetRoleEnum> {
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
  final Iterable<Type> types = const <Type>[
    BroadcastNotificationBodyTargetRoleEnum
  ];
  @override
  final String wireName = 'BroadcastNotificationBodyTargetRoleEnum';

  @override
  Object serialize(Serializers serializers,
          BroadcastNotificationBodyTargetRoleEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  BroadcastNotificationBodyTargetRoleEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      BroadcastNotificationBodyTargetRoleEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$BroadcastNotificationBody extends BroadcastNotificationBody {
  @override
  final String title;
  @override
  final String message;
  @override
  final BroadcastNotificationBodyTypeEnum? type;
  @override
  final BroadcastNotificationBodyAudienceTypeEnum? audienceType;
  @override
  final String? audienceValue;
  @override
  final BroadcastNotificationBodyTargetRoleEnum? targetRole;

  factory _$BroadcastNotificationBody(
          [void Function(BroadcastNotificationBodyBuilder)? updates]) =>
      (BroadcastNotificationBodyBuilder()..update(updates))._build();

  _$BroadcastNotificationBody._(
      {required this.title,
      required this.message,
      this.type,
      this.audienceType,
      this.audienceValue,
      this.targetRole})
      : super._();
  @override
  BroadcastNotificationBody rebuild(
          void Function(BroadcastNotificationBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  BroadcastNotificationBodyBuilder toBuilder() =>
      BroadcastNotificationBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is BroadcastNotificationBody &&
        title == other.title &&
        message == other.message &&
        type == other.type &&
        audienceType == other.audienceType &&
        audienceValue == other.audienceValue &&
        targetRole == other.targetRole;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, title.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, type.hashCode);
    _$hash = $jc(_$hash, audienceType.hashCode);
    _$hash = $jc(_$hash, audienceValue.hashCode);
    _$hash = $jc(_$hash, targetRole.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'BroadcastNotificationBody')
          ..add('title', title)
          ..add('message', message)
          ..add('type', type)
          ..add('audienceType', audienceType)
          ..add('audienceValue', audienceValue)
          ..add('targetRole', targetRole))
        .toString();
  }
}

class BroadcastNotificationBodyBuilder
    implements
        Builder<BroadcastNotificationBody, BroadcastNotificationBodyBuilder> {
  _$BroadcastNotificationBody? _$v;

  String? _title;
  String? get title => _$this._title;
  set title(String? title) => _$this._title = title;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  BroadcastNotificationBodyTypeEnum? _type;
  BroadcastNotificationBodyTypeEnum? get type => _$this._type;
  set type(BroadcastNotificationBodyTypeEnum? type) => _$this._type = type;

  BroadcastNotificationBodyAudienceTypeEnum? _audienceType;
  BroadcastNotificationBodyAudienceTypeEnum? get audienceType =>
      _$this._audienceType;
  set audienceType(BroadcastNotificationBodyAudienceTypeEnum? audienceType) =>
      _$this._audienceType = audienceType;

  String? _audienceValue;
  String? get audienceValue => _$this._audienceValue;
  set audienceValue(String? audienceValue) =>
      _$this._audienceValue = audienceValue;

  BroadcastNotificationBodyTargetRoleEnum? _targetRole;
  BroadcastNotificationBodyTargetRoleEnum? get targetRole => _$this._targetRole;
  set targetRole(BroadcastNotificationBodyTargetRoleEnum? targetRole) =>
      _$this._targetRole = targetRole;

  BroadcastNotificationBodyBuilder() {
    BroadcastNotificationBody._defaults(this);
  }

  BroadcastNotificationBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _title = $v.title;
      _message = $v.message;
      _type = $v.type;
      _audienceType = $v.audienceType;
      _audienceValue = $v.audienceValue;
      _targetRole = $v.targetRole;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(BroadcastNotificationBody other) {
    _$v = other as _$BroadcastNotificationBody;
  }

  @override
  void update(void Function(BroadcastNotificationBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  BroadcastNotificationBody build() => _build();

  _$BroadcastNotificationBody _build() {
    final _$result = _$v ??
        _$BroadcastNotificationBody._(
          title: BuiltValueNullFieldError.checkNotNull(
              title, r'BroadcastNotificationBody', 'title'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'BroadcastNotificationBody', 'message'),
          type: type,
          audienceType: audienceType,
          audienceValue: audienceValue,
          targetRole: targetRole,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

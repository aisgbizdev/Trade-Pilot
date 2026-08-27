// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_price_alert.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserPriceAlertTriggerDirectionEnum
    _$userPriceAlertTriggerDirectionEnum_above =
    const UserPriceAlertTriggerDirectionEnum._('above');
const UserPriceAlertTriggerDirectionEnum
    _$userPriceAlertTriggerDirectionEnum_below =
    const UserPriceAlertTriggerDirectionEnum._('below');

UserPriceAlertTriggerDirectionEnum _$userPriceAlertTriggerDirectionEnumValueOf(
    String name) {
  switch (name) {
    case 'above':
      return _$userPriceAlertTriggerDirectionEnum_above;
    case 'below':
      return _$userPriceAlertTriggerDirectionEnum_below;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserPriceAlertTriggerDirectionEnum>
    _$userPriceAlertTriggerDirectionEnumValues = BuiltSet<
        UserPriceAlertTriggerDirectionEnum>(const <UserPriceAlertTriggerDirectionEnum>[
  _$userPriceAlertTriggerDirectionEnum_above,
  _$userPriceAlertTriggerDirectionEnum_below,
]);

const UserPriceAlertStatusEnum _$userPriceAlertStatusEnum_active =
    const UserPriceAlertStatusEnum._('active');
const UserPriceAlertStatusEnum _$userPriceAlertStatusEnum_triggered =
    const UserPriceAlertStatusEnum._('triggered');
const UserPriceAlertStatusEnum _$userPriceAlertStatusEnum_cancelled =
    const UserPriceAlertStatusEnum._('cancelled');

UserPriceAlertStatusEnum _$userPriceAlertStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$userPriceAlertStatusEnum_active;
    case 'triggered':
      return _$userPriceAlertStatusEnum_triggered;
    case 'cancelled':
      return _$userPriceAlertStatusEnum_cancelled;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserPriceAlertStatusEnum> _$userPriceAlertStatusEnumValues =
    BuiltSet<UserPriceAlertStatusEnum>(const <UserPriceAlertStatusEnum>[
  _$userPriceAlertStatusEnum_active,
  _$userPriceAlertStatusEnum_triggered,
  _$userPriceAlertStatusEnum_cancelled,
]);

Serializer<UserPriceAlertTriggerDirectionEnum>
    _$userPriceAlertTriggerDirectionEnumSerializer =
    _$UserPriceAlertTriggerDirectionEnumSerializer();
Serializer<UserPriceAlertStatusEnum> _$userPriceAlertStatusEnumSerializer =
    _$UserPriceAlertStatusEnumSerializer();

class _$UserPriceAlertTriggerDirectionEnumSerializer
    implements PrimitiveSerializer<UserPriceAlertTriggerDirectionEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'above': 'above',
    'below': 'below',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'above': 'above',
    'below': 'below',
  };

  @override
  final Iterable<Type> types = const <Type>[UserPriceAlertTriggerDirectionEnum];
  @override
  final String wireName = 'UserPriceAlertTriggerDirectionEnum';

  @override
  Object serialize(
          Serializers serializers, UserPriceAlertTriggerDirectionEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserPriceAlertTriggerDirectionEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserPriceAlertTriggerDirectionEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserPriceAlertStatusEnumSerializer
    implements PrimitiveSerializer<UserPriceAlertStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'active': 'active',
    'triggered': 'triggered',
    'cancelled': 'cancelled',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'active': 'active',
    'triggered': 'triggered',
    'cancelled': 'cancelled',
  };

  @override
  final Iterable<Type> types = const <Type>[UserPriceAlertStatusEnum];
  @override
  final String wireName = 'UserPriceAlertStatusEnum';

  @override
  Object serialize(Serializers serializers, UserPriceAlertStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserPriceAlertStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserPriceAlertStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserPriceAlert extends UserPriceAlert {
  @override
  final int id;
  @override
  final String instrument;
  @override
  final String targetPrice;
  @override
  final UserPriceAlertTriggerDirectionEnum triggerDirection;
  @override
  final String? note;
  @override
  final UserPriceAlertStatusEnum status;
  @override
  final DateTime? triggeredAt;
  @override
  final String? triggeredPrice;
  @override
  final DateTime createdAt;

  factory _$UserPriceAlert([void Function(UserPriceAlertBuilder)? updates]) =>
      (UserPriceAlertBuilder()..update(updates))._build();

  _$UserPriceAlert._(
      {required this.id,
      required this.instrument,
      required this.targetPrice,
      required this.triggerDirection,
      this.note,
      required this.status,
      this.triggeredAt,
      this.triggeredPrice,
      required this.createdAt})
      : super._();
  @override
  UserPriceAlert rebuild(void Function(UserPriceAlertBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserPriceAlertBuilder toBuilder() => UserPriceAlertBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserPriceAlert &&
        id == other.id &&
        instrument == other.instrument &&
        targetPrice == other.targetPrice &&
        triggerDirection == other.triggerDirection &&
        note == other.note &&
        status == other.status &&
        triggeredAt == other.triggeredAt &&
        triggeredPrice == other.triggeredPrice &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, targetPrice.hashCode);
    _$hash = $jc(_$hash, triggerDirection.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, triggeredAt.hashCode);
    _$hash = $jc(_$hash, triggeredPrice.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserPriceAlert')
          ..add('id', id)
          ..add('instrument', instrument)
          ..add('targetPrice', targetPrice)
          ..add('triggerDirection', triggerDirection)
          ..add('note', note)
          ..add('status', status)
          ..add('triggeredAt', triggeredAt)
          ..add('triggeredPrice', triggeredPrice)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class UserPriceAlertBuilder
    implements Builder<UserPriceAlert, UserPriceAlertBuilder> {
  _$UserPriceAlert? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  String? _targetPrice;
  String? get targetPrice => _$this._targetPrice;
  set targetPrice(String? targetPrice) => _$this._targetPrice = targetPrice;

  UserPriceAlertTriggerDirectionEnum? _triggerDirection;
  UserPriceAlertTriggerDirectionEnum? get triggerDirection =>
      _$this._triggerDirection;
  set triggerDirection(UserPriceAlertTriggerDirectionEnum? triggerDirection) =>
      _$this._triggerDirection = triggerDirection;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  UserPriceAlertStatusEnum? _status;
  UserPriceAlertStatusEnum? get status => _$this._status;
  set status(UserPriceAlertStatusEnum? status) => _$this._status = status;

  DateTime? _triggeredAt;
  DateTime? get triggeredAt => _$this._triggeredAt;
  set triggeredAt(DateTime? triggeredAt) => _$this._triggeredAt = triggeredAt;

  String? _triggeredPrice;
  String? get triggeredPrice => _$this._triggeredPrice;
  set triggeredPrice(String? triggeredPrice) =>
      _$this._triggeredPrice = triggeredPrice;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  UserPriceAlertBuilder() {
    UserPriceAlert._defaults(this);
  }

  UserPriceAlertBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _instrument = $v.instrument;
      _targetPrice = $v.targetPrice;
      _triggerDirection = $v.triggerDirection;
      _note = $v.note;
      _status = $v.status;
      _triggeredAt = $v.triggeredAt;
      _triggeredPrice = $v.triggeredPrice;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserPriceAlert other) {
    _$v = other as _$UserPriceAlert;
  }

  @override
  void update(void Function(UserPriceAlertBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserPriceAlert build() => _build();

  _$UserPriceAlert _build() {
    final _$result = _$v ??
        _$UserPriceAlert._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'UserPriceAlert', 'id'),
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'UserPriceAlert', 'instrument'),
          targetPrice: BuiltValueNullFieldError.checkNotNull(
              targetPrice, r'UserPriceAlert', 'targetPrice'),
          triggerDirection: BuiltValueNullFieldError.checkNotNull(
              triggerDirection, r'UserPriceAlert', 'triggerDirection'),
          note: note,
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'UserPriceAlert', 'status'),
          triggeredAt: triggeredAt,
          triggeredPrice: triggeredPrice,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'UserPriceAlert', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

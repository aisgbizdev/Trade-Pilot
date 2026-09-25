// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_with_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserWithStatsRoleEnum _$userWithStatsRoleEnum_user =
    const UserWithStatsRoleEnum._('user');
const UserWithStatsRoleEnum _$userWithStatsRoleEnum_admin =
    const UserWithStatsRoleEnum._('admin');
const UserWithStatsRoleEnum _$userWithStatsRoleEnum_superAdmin =
    const UserWithStatsRoleEnum._('superAdmin');

UserWithStatsRoleEnum _$userWithStatsRoleEnumValueOf(String name) {
  switch (name) {
    case 'user':
      return _$userWithStatsRoleEnum_user;
    case 'admin':
      return _$userWithStatsRoleEnum_admin;
    case 'superAdmin':
      return _$userWithStatsRoleEnum_superAdmin;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserWithStatsRoleEnum> _$userWithStatsRoleEnumValues =
    BuiltSet<UserWithStatsRoleEnum>(const <UserWithStatsRoleEnum>[
  _$userWithStatsRoleEnum_user,
  _$userWithStatsRoleEnum_admin,
  _$userWithStatsRoleEnum_superAdmin,
]);

const UserWithStatsSelectedModeEnum _$userWithStatsSelectedModeEnum_beginner =
    const UserWithStatsSelectedModeEnum._('beginner');
const UserWithStatsSelectedModeEnum _$userWithStatsSelectedModeEnum_pro =
    const UserWithStatsSelectedModeEnum._('pro');

UserWithStatsSelectedModeEnum _$userWithStatsSelectedModeEnumValueOf(
    String name) {
  switch (name) {
    case 'beginner':
      return _$userWithStatsSelectedModeEnum_beginner;
    case 'pro':
      return _$userWithStatsSelectedModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserWithStatsSelectedModeEnum>
    _$userWithStatsSelectedModeEnumValues = BuiltSet<
        UserWithStatsSelectedModeEnum>(const <UserWithStatsSelectedModeEnum>[
  _$userWithStatsSelectedModeEnum_beginner,
  _$userWithStatsSelectedModeEnum_pro,
]);

const UserWithStatsSegmentEnum _$userWithStatsSegmentEnum_free =
    const UserWithStatsSegmentEnum._('free');
const UserWithStatsSegmentEnum _$userWithStatsSegmentEnum_paid =
    const UserWithStatsSegmentEnum._('paid');
const UserWithStatsSegmentEnum _$userWithStatsSegmentEnum_dev =
    const UserWithStatsSegmentEnum._('dev');

UserWithStatsSegmentEnum _$userWithStatsSegmentEnumValueOf(String name) {
  switch (name) {
    case 'free':
      return _$userWithStatsSegmentEnum_free;
    case 'paid':
      return _$userWithStatsSegmentEnum_paid;
    case 'dev':
      return _$userWithStatsSegmentEnum_dev;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UserWithStatsSegmentEnum> _$userWithStatsSegmentEnumValues =
    BuiltSet<UserWithStatsSegmentEnum>(const <UserWithStatsSegmentEnum>[
  _$userWithStatsSegmentEnum_free,
  _$userWithStatsSegmentEnum_paid,
  _$userWithStatsSegmentEnum_dev,
]);

Serializer<UserWithStatsRoleEnum> _$userWithStatsRoleEnumSerializer =
    _$UserWithStatsRoleEnumSerializer();
Serializer<UserWithStatsSelectedModeEnum>
    _$userWithStatsSelectedModeEnumSerializer =
    _$UserWithStatsSelectedModeEnumSerializer();
Serializer<UserWithStatsSegmentEnum> _$userWithStatsSegmentEnumSerializer =
    _$UserWithStatsSegmentEnumSerializer();

class _$UserWithStatsRoleEnumSerializer
    implements PrimitiveSerializer<UserWithStatsRoleEnum> {
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
  final Iterable<Type> types = const <Type>[UserWithStatsRoleEnum];
  @override
  final String wireName = 'UserWithStatsRoleEnum';

  @override
  Object serialize(Serializers serializers, UserWithStatsRoleEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserWithStatsRoleEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserWithStatsRoleEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserWithStatsSelectedModeEnumSerializer
    implements PrimitiveSerializer<UserWithStatsSelectedModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[UserWithStatsSelectedModeEnum];
  @override
  final String wireName = 'UserWithStatsSelectedModeEnum';

  @override
  Object serialize(
          Serializers serializers, UserWithStatsSelectedModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserWithStatsSelectedModeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserWithStatsSelectedModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserWithStatsSegmentEnumSerializer
    implements PrimitiveSerializer<UserWithStatsSegmentEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'free': 'free',
    'paid': 'paid',
    'dev': 'dev',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'free': 'free',
    'paid': 'paid',
    'dev': 'dev',
  };

  @override
  final Iterable<Type> types = const <Type>[UserWithStatsSegmentEnum];
  @override
  final String wireName = 'UserWithStatsSegmentEnum';

  @override
  Object serialize(Serializers serializers, UserWithStatsSegmentEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserWithStatsSegmentEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserWithStatsSegmentEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserWithStats extends UserWithStats {
  @override
  final int id;
  @override
  final String email;
  @override
  final String displayName;
  @override
  final UserWithStatsRoleEnum role;
  @override
  final UserWithStatsSelectedModeEnum selectedMode;
  @override
  final int analysisCount;
  @override
  final int creditBalance;
  @override
  final BuiltList<String> tags;
  @override
  final int customQuotaPerDay;
  @override
  final UserWithStatsSegmentEnum segment;
  @override
  final DateTime createdAt;

  factory _$UserWithStats([void Function(UserWithStatsBuilder)? updates]) =>
      (UserWithStatsBuilder()..update(updates))._build();

  _$UserWithStats._(
      {required this.id,
      required this.email,
      required this.displayName,
      required this.role,
      required this.selectedMode,
      required this.analysisCount,
      required this.creditBalance,
      required this.tags,
      required this.customQuotaPerDay,
      required this.segment,
      required this.createdAt})
      : super._();
  @override
  UserWithStats rebuild(void Function(UserWithStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserWithStatsBuilder toBuilder() => UserWithStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserWithStats &&
        id == other.id &&
        email == other.email &&
        displayName == other.displayName &&
        role == other.role &&
        selectedMode == other.selectedMode &&
        analysisCount == other.analysisCount &&
        creditBalance == other.creditBalance &&
        tags == other.tags &&
        customQuotaPerDay == other.customQuotaPerDay &&
        segment == other.segment &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jc(_$hash, selectedMode.hashCode);
    _$hash = $jc(_$hash, analysisCount.hashCode);
    _$hash = $jc(_$hash, creditBalance.hashCode);
    _$hash = $jc(_$hash, tags.hashCode);
    _$hash = $jc(_$hash, customQuotaPerDay.hashCode);
    _$hash = $jc(_$hash, segment.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserWithStats')
          ..add('id', id)
          ..add('email', email)
          ..add('displayName', displayName)
          ..add('role', role)
          ..add('selectedMode', selectedMode)
          ..add('analysisCount', analysisCount)
          ..add('creditBalance', creditBalance)
          ..add('tags', tags)
          ..add('customQuotaPerDay', customQuotaPerDay)
          ..add('segment', segment)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class UserWithStatsBuilder
    implements Builder<UserWithStats, UserWithStatsBuilder> {
  _$UserWithStats? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  UserWithStatsRoleEnum? _role;
  UserWithStatsRoleEnum? get role => _$this._role;
  set role(UserWithStatsRoleEnum? role) => _$this._role = role;

  UserWithStatsSelectedModeEnum? _selectedMode;
  UserWithStatsSelectedModeEnum? get selectedMode => _$this._selectedMode;
  set selectedMode(UserWithStatsSelectedModeEnum? selectedMode) =>
      _$this._selectedMode = selectedMode;

  int? _analysisCount;
  int? get analysisCount => _$this._analysisCount;
  set analysisCount(int? analysisCount) =>
      _$this._analysisCount = analysisCount;

  int? _creditBalance;
  int? get creditBalance => _$this._creditBalance;
  set creditBalance(int? creditBalance) =>
      _$this._creditBalance = creditBalance;

  ListBuilder<String>? _tags;
  ListBuilder<String> get tags => _$this._tags ??= ListBuilder<String>();
  set tags(ListBuilder<String>? tags) => _$this._tags = tags;

  int? _customQuotaPerDay;
  int? get customQuotaPerDay => _$this._customQuotaPerDay;
  set customQuotaPerDay(int? customQuotaPerDay) =>
      _$this._customQuotaPerDay = customQuotaPerDay;

  UserWithStatsSegmentEnum? _segment;
  UserWithStatsSegmentEnum? get segment => _$this._segment;
  set segment(UserWithStatsSegmentEnum? segment) => _$this._segment = segment;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  UserWithStatsBuilder() {
    UserWithStats._defaults(this);
  }

  UserWithStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _email = $v.email;
      _displayName = $v.displayName;
      _role = $v.role;
      _selectedMode = $v.selectedMode;
      _analysisCount = $v.analysisCount;
      _creditBalance = $v.creditBalance;
      _tags = $v.tags.toBuilder();
      _customQuotaPerDay = $v.customQuotaPerDay;
      _segment = $v.segment;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserWithStats other) {
    _$v = other as _$UserWithStats;
  }

  @override
  void update(void Function(UserWithStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserWithStats build() => _build();

  _$UserWithStats _build() {
    _$UserWithStats _$result;
    try {
      _$result = _$v ??
          _$UserWithStats._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'UserWithStats', 'id'),
            email: BuiltValueNullFieldError.checkNotNull(
                email, r'UserWithStats', 'email'),
            displayName: BuiltValueNullFieldError.checkNotNull(
                displayName, r'UserWithStats', 'displayName'),
            role: BuiltValueNullFieldError.checkNotNull(
                role, r'UserWithStats', 'role'),
            selectedMode: BuiltValueNullFieldError.checkNotNull(
                selectedMode, r'UserWithStats', 'selectedMode'),
            analysisCount: BuiltValueNullFieldError.checkNotNull(
                analysisCount, r'UserWithStats', 'analysisCount'),
            creditBalance: BuiltValueNullFieldError.checkNotNull(
                creditBalance, r'UserWithStats', 'creditBalance'),
            tags: tags.build(),
            customQuotaPerDay: BuiltValueNullFieldError.checkNotNull(
                customQuotaPerDay, r'UserWithStats', 'customQuotaPerDay'),
            segment: BuiltValueNullFieldError.checkNotNull(
                segment, r'UserWithStats', 'segment'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'UserWithStats', 'createdAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'tags';
        tags.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserWithStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

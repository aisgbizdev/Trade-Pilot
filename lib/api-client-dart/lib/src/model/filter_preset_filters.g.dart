// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'filter_preset_filters.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FilterPresetFiltersModeEnum _$filterPresetFiltersModeEnum_empty =
    const FilterPresetFiltersModeEnum._('empty');
const FilterPresetFiltersModeEnum _$filterPresetFiltersModeEnum_beginner =
    const FilterPresetFiltersModeEnum._('beginner');
const FilterPresetFiltersModeEnum _$filterPresetFiltersModeEnum_pro =
    const FilterPresetFiltersModeEnum._('pro');

FilterPresetFiltersModeEnum _$filterPresetFiltersModeEnumValueOf(String name) {
  switch (name) {
    case 'empty':
      return _$filterPresetFiltersModeEnum_empty;
    case 'beginner':
      return _$filterPresetFiltersModeEnum_beginner;
    case 'pro':
      return _$filterPresetFiltersModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FilterPresetFiltersModeEnum>
    _$filterPresetFiltersModeEnumValues =
    BuiltSet<FilterPresetFiltersModeEnum>(const <FilterPresetFiltersModeEnum>[
  _$filterPresetFiltersModeEnum_empty,
  _$filterPresetFiltersModeEnum_beginner,
  _$filterPresetFiltersModeEnum_pro,
]);

Serializer<FilterPresetFiltersModeEnum>
    _$filterPresetFiltersModeEnumSerializer =
    _$FilterPresetFiltersModeEnumSerializer();

class _$FilterPresetFiltersModeEnumSerializer
    implements PrimitiveSerializer<FilterPresetFiltersModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'empty': '',
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    '': 'empty',
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[FilterPresetFiltersModeEnum];
  @override
  final String wireName = 'FilterPresetFiltersModeEnum';

  @override
  Object serialize(Serializers serializers, FilterPresetFiltersModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FilterPresetFiltersModeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FilterPresetFiltersModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FilterPresetFilters extends FilterPresetFilters {
  @override
  final FilterPresetFiltersModeEnum mode;
  @override
  final BuiltList<String> instruments;
  @override
  final BuiltList<String> timeframes;
  @override
  final String from;
  @override
  final String to;
  @override
  final String q;

  factory _$FilterPresetFilters(
          [void Function(FilterPresetFiltersBuilder)? updates]) =>
      (FilterPresetFiltersBuilder()..update(updates))._build();

  _$FilterPresetFilters._(
      {required this.mode,
      required this.instruments,
      required this.timeframes,
      required this.from,
      required this.to,
      required this.q})
      : super._();
  @override
  FilterPresetFilters rebuild(
          void Function(FilterPresetFiltersBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FilterPresetFiltersBuilder toBuilder() =>
      FilterPresetFiltersBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FilterPresetFilters &&
        mode == other.mode &&
        instruments == other.instruments &&
        timeframes == other.timeframes &&
        from == other.from &&
        to == other.to &&
        q == other.q;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, mode.hashCode);
    _$hash = $jc(_$hash, instruments.hashCode);
    _$hash = $jc(_$hash, timeframes.hashCode);
    _$hash = $jc(_$hash, from.hashCode);
    _$hash = $jc(_$hash, to.hashCode);
    _$hash = $jc(_$hash, q.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FilterPresetFilters')
          ..add('mode', mode)
          ..add('instruments', instruments)
          ..add('timeframes', timeframes)
          ..add('from', from)
          ..add('to', to)
          ..add('q', q))
        .toString();
  }
}

class FilterPresetFiltersBuilder
    implements Builder<FilterPresetFilters, FilterPresetFiltersBuilder> {
  _$FilterPresetFilters? _$v;

  FilterPresetFiltersModeEnum? _mode;
  FilterPresetFiltersModeEnum? get mode => _$this._mode;
  set mode(FilterPresetFiltersModeEnum? mode) => _$this._mode = mode;

  ListBuilder<String>? _instruments;
  ListBuilder<String> get instruments =>
      _$this._instruments ??= ListBuilder<String>();
  set instruments(ListBuilder<String>? instruments) =>
      _$this._instruments = instruments;

  ListBuilder<String>? _timeframes;
  ListBuilder<String> get timeframes =>
      _$this._timeframes ??= ListBuilder<String>();
  set timeframes(ListBuilder<String>? timeframes) =>
      _$this._timeframes = timeframes;

  String? _from;
  String? get from => _$this._from;
  set from(String? from) => _$this._from = from;

  String? _to;
  String? get to => _$this._to;
  set to(String? to) => _$this._to = to;

  String? _q;
  String? get q => _$this._q;
  set q(String? q) => _$this._q = q;

  FilterPresetFiltersBuilder() {
    FilterPresetFilters._defaults(this);
  }

  FilterPresetFiltersBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _mode = $v.mode;
      _instruments = $v.instruments.toBuilder();
      _timeframes = $v.timeframes.toBuilder();
      _from = $v.from;
      _to = $v.to;
      _q = $v.q;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FilterPresetFilters other) {
    _$v = other as _$FilterPresetFilters;
  }

  @override
  void update(void Function(FilterPresetFiltersBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FilterPresetFilters build() => _build();

  _$FilterPresetFilters _build() {
    _$FilterPresetFilters _$result;
    try {
      _$result = _$v ??
          _$FilterPresetFilters._(
            mode: BuiltValueNullFieldError.checkNotNull(
                mode, r'FilterPresetFilters', 'mode'),
            instruments: instruments.build(),
            timeframes: timeframes.build(),
            from: BuiltValueNullFieldError.checkNotNull(
                from, r'FilterPresetFilters', 'from'),
            to: BuiltValueNullFieldError.checkNotNull(
                to, r'FilterPresetFilters', 'to'),
            q: BuiltValueNullFieldError.checkNotNull(
                q, r'FilterPresetFilters', 'q'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'instruments';
        instruments.build();
        _$failedField = 'timeframes';
        timeframes.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FilterPresetFilters', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

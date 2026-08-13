// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_citations.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FundamentalCitations extends FundamentalCitations {
  @override
  final BuiltList<String> newsTitles;
  @override
  final BuiltList<String> calendarEvents;

  factory _$FundamentalCitations(
          [void Function(FundamentalCitationsBuilder)? updates]) =>
      (FundamentalCitationsBuilder()..update(updates))._build();

  _$FundamentalCitations._(
      {required this.newsTitles, required this.calendarEvents})
      : super._();
  @override
  FundamentalCitations rebuild(
          void Function(FundamentalCitationsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalCitationsBuilder toBuilder() =>
      FundamentalCitationsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalCitations &&
        newsTitles == other.newsTitles &&
        calendarEvents == other.calendarEvents;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, newsTitles.hashCode);
    _$hash = $jc(_$hash, calendarEvents.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalCitations')
          ..add('newsTitles', newsTitles)
          ..add('calendarEvents', calendarEvents))
        .toString();
  }
}

class FundamentalCitationsBuilder
    implements Builder<FundamentalCitations, FundamentalCitationsBuilder> {
  _$FundamentalCitations? _$v;

  ListBuilder<String>? _newsTitles;
  ListBuilder<String> get newsTitles =>
      _$this._newsTitles ??= ListBuilder<String>();
  set newsTitles(ListBuilder<String>? newsTitles) =>
      _$this._newsTitles = newsTitles;

  ListBuilder<String>? _calendarEvents;
  ListBuilder<String> get calendarEvents =>
      _$this._calendarEvents ??= ListBuilder<String>();
  set calendarEvents(ListBuilder<String>? calendarEvents) =>
      _$this._calendarEvents = calendarEvents;

  FundamentalCitationsBuilder() {
    FundamentalCitations._defaults(this);
  }

  FundamentalCitationsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _newsTitles = $v.newsTitles.toBuilder();
      _calendarEvents = $v.calendarEvents.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalCitations other) {
    _$v = other as _$FundamentalCitations;
  }

  @override
  void update(void Function(FundamentalCitationsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalCitations build() => _build();

  _$FundamentalCitations _build() {
    _$FundamentalCitations _$result;
    try {
      _$result = _$v ??
          _$FundamentalCitations._(
            newsTitles: newsTitles.build(),
            calendarEvents: calendarEvents.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'newsTitles';
        newsTitles.build();
        _$failedField = 'calendarEvents';
        calendarEvents.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FundamentalCitations', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

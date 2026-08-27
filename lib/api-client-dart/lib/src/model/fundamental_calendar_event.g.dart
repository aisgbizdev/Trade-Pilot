// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_calendar_event.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FundamentalCalendarEvent extends FundamentalCalendarEvent {
  @override
  final String date;
  @override
  final String time;
  @override
  final String currency;
  @override
  final String event;
  @override
  final String impact;
  @override
  final String actual;
  @override
  final String forecast;
  @override
  final String previous;

  factory _$FundamentalCalendarEvent(
          [void Function(FundamentalCalendarEventBuilder)? updates]) =>
      (FundamentalCalendarEventBuilder()..update(updates))._build();

  _$FundamentalCalendarEvent._(
      {required this.date,
      required this.time,
      required this.currency,
      required this.event,
      required this.impact,
      required this.actual,
      required this.forecast,
      required this.previous})
      : super._();
  @override
  FundamentalCalendarEvent rebuild(
          void Function(FundamentalCalendarEventBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalCalendarEventBuilder toBuilder() =>
      FundamentalCalendarEventBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalCalendarEvent &&
        date == other.date &&
        time == other.time &&
        currency == other.currency &&
        event == other.event &&
        impact == other.impact &&
        actual == other.actual &&
        forecast == other.forecast &&
        previous == other.previous;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, date.hashCode);
    _$hash = $jc(_$hash, time.hashCode);
    _$hash = $jc(_$hash, currency.hashCode);
    _$hash = $jc(_$hash, event.hashCode);
    _$hash = $jc(_$hash, impact.hashCode);
    _$hash = $jc(_$hash, actual.hashCode);
    _$hash = $jc(_$hash, forecast.hashCode);
    _$hash = $jc(_$hash, previous.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalCalendarEvent')
          ..add('date', date)
          ..add('time', time)
          ..add('currency', currency)
          ..add('event', event)
          ..add('impact', impact)
          ..add('actual', actual)
          ..add('forecast', forecast)
          ..add('previous', previous))
        .toString();
  }
}

class FundamentalCalendarEventBuilder
    implements
        Builder<FundamentalCalendarEvent, FundamentalCalendarEventBuilder> {
  _$FundamentalCalendarEvent? _$v;

  String? _date;
  String? get date => _$this._date;
  set date(String? date) => _$this._date = date;

  String? _time;
  String? get time => _$this._time;
  set time(String? time) => _$this._time = time;

  String? _currency;
  String? get currency => _$this._currency;
  set currency(String? currency) => _$this._currency = currency;

  String? _event;
  String? get event => _$this._event;
  set event(String? event) => _$this._event = event;

  String? _impact;
  String? get impact => _$this._impact;
  set impact(String? impact) => _$this._impact = impact;

  String? _actual;
  String? get actual => _$this._actual;
  set actual(String? actual) => _$this._actual = actual;

  String? _forecast;
  String? get forecast => _$this._forecast;
  set forecast(String? forecast) => _$this._forecast = forecast;

  String? _previous;
  String? get previous => _$this._previous;
  set previous(String? previous) => _$this._previous = previous;

  FundamentalCalendarEventBuilder() {
    FundamentalCalendarEvent._defaults(this);
  }

  FundamentalCalendarEventBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _date = $v.date;
      _time = $v.time;
      _currency = $v.currency;
      _event = $v.event;
      _impact = $v.impact;
      _actual = $v.actual;
      _forecast = $v.forecast;
      _previous = $v.previous;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalCalendarEvent other) {
    _$v = other as _$FundamentalCalendarEvent;
  }

  @override
  void update(void Function(FundamentalCalendarEventBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalCalendarEvent build() => _build();

  _$FundamentalCalendarEvent _build() {
    final _$result = _$v ??
        _$FundamentalCalendarEvent._(
          date: BuiltValueNullFieldError.checkNotNull(
              date, r'FundamentalCalendarEvent', 'date'),
          time: BuiltValueNullFieldError.checkNotNull(
              time, r'FundamentalCalendarEvent', 'time'),
          currency: BuiltValueNullFieldError.checkNotNull(
              currency, r'FundamentalCalendarEvent', 'currency'),
          event: BuiltValueNullFieldError.checkNotNull(
              event, r'FundamentalCalendarEvent', 'event'),
          impact: BuiltValueNullFieldError.checkNotNull(
              impact, r'FundamentalCalendarEvent', 'impact'),
          actual: BuiltValueNullFieldError.checkNotNull(
              actual, r'FundamentalCalendarEvent', 'actual'),
          forecast: BuiltValueNullFieldError.checkNotNull(
              forecast, r'FundamentalCalendarEvent', 'forecast'),
          previous: BuiltValueNullFieldError.checkNotNull(
              previous, r'FundamentalCalendarEvent', 'previous'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
